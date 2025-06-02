import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/prisma";
import { sendLaunchMessage, sendTestMessage, validateEvolutionApiConfig } from "@/lib/evolution-api";

interface LaunchPayload {
  launchTime: string;
  subscribersCount: number;
  source: string;
}

interface Subscriber {
  id: string;
  name: string;
  whatsapp: string;
  isNotified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 🎯 ESTE É O JOB PRINCIPAL DO TRIGGER.DEV
export const sendLaunchNotifications = task({
  id: "send-launch-notifications",
  run: async (payload: LaunchPayload) => {
    console.log("🚀 [TRIGGER.DEV] Iniciando envio de notificações de lançamento");
    console.log("📊 [TRIGGER.DEV] Payload recebido:", payload);

    try {
      // Validar configuração da Evolution API
      if (!validateEvolutionApiConfig()) {
        throw new Error("Configuração da Evolution API incompleta. Verifique as variáveis de ambiente.");
      }

      // Buscar todos os inscritos que ainda não foram notificados
      const subscribers = await prisma.notificationSubscriber.findMany({
        where: {
          isNotified: false
        }
      });

      console.log(`📊 [TRIGGER.DEV] Encontrados ${subscribers.length} inscritos para notificar`);

      if (subscribers.length === 0) {
        console.log("ℹ️ [TRIGGER.DEV] Nenhum inscrito encontrado para notificar");
        return { 
          success: true, 
          notified: 0,
          message: "Nenhum inscrito encontrado"
        };
      }

      // Enviar notificações para cada inscrito
      const results = await Promise.allSettled(
        subscribers.map(async (subscriber: Subscriber) => {
          try {
            console.log(`📱 [TRIGGER.DEV] Enviando para ${subscriber.name} (${subscriber.whatsapp})`);
            
            // Usar a função utilitária para enviar via Evolution API
            const result = await sendLaunchMessage(subscriber.name, subscriber.whatsapp);

            if (!result.success) {
              throw new Error(result.error || 'Falha no envio via Evolution API');
            }

            // Aguardar um pouco entre envios para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Marcar como notificado
            await prisma.notificationSubscriber.update({
              where: { id: subscriber.id },
              data: { isNotified: true }
            });

            console.log(`✅ [TRIGGER.DEV] Notificação enviada para ${subscriber.name}`);
            
            return { 
              success: true, 
              subscriber: subscriber.name,
              whatsapp: subscriber.whatsapp,
              messageId: result.data?.key?.id
            };

          } catch (error) {
            console.error(`❌ [TRIGGER.DEV] Erro ao enviar para ${subscriber.name}:`, error);
            throw error;
          }
        })
      );

      // Contar sucessos e falhas
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      console.log(`📈 [TRIGGER.DEV] Resultado: ${successful} sucessos, ${failed} falhas`);

      // Log das falhas para debug
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ [TRIGGER.DEV] Falha ao notificar ${subscribers[index].name}:`, result.reason);
        }
      });

      return {
        success: true,
        total: subscribers.length,
        successful,
        failed,
        launchTime: payload.launchTime,
        source: payload.source
      };

    } catch (error) {
      console.error("💥 [TRIGGER.DEV] Erro crítico:", error);
      throw error;
    }
  },
});

// 🧪 JOB DE TESTE INDIVIDUAL COM EVOLUTION API
export const testNotification = task({
  id: "test-notification",
  run: async (payload: { subscriberId: string }) => {
    console.log(`🧪 [TRIGGER.DEV] Testando notificação para inscrito ${payload.subscriberId}`);

    try {
      // Validar configuração da Evolution API
      if (!validateEvolutionApiConfig()) {
        throw new Error("Configuração da Evolution API incompleta. Verifique as variáveis de ambiente.");
      }

      const subscriber = await prisma.notificationSubscriber.findUnique({
        where: { id: payload.subscriberId }
      });

      if (!subscriber) {
        throw new Error("Inscrito não encontrado");
      }

      console.log(`📱 [TRIGGER.DEV] Enviando teste para ${subscriber.name}`);

      // Usar a função utilitária para enviar mensagem de teste
      const result = await sendTestMessage(subscriber.name, subscriber.whatsapp);

      if (!result.success) {
        throw new Error(result.error || 'Falha no envio de teste via Evolution API');
      }

      console.log(`✅ [TRIGGER.DEV] Teste enviado com sucesso para ${subscriber.name}`);

      return {
        success: true,
        subscriber: subscriber.name,
        whatsapp: subscriber.whatsapp,
        testTime: new Date().toISOString(),
        messageId: result.data?.key?.id
      };

    } catch (error) {
      console.error("💥 [TRIGGER.DEV] Erro no teste:", error);
      throw error;
    }
  },
}); 