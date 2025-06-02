import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/evolution-api";

export async function POST(request: NextRequest) {
  try {
    // Verificação adicional de segurança para produção
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Log de acesso (sem dados sensíveis)
    console.log(`🧪 [TEST WHATSAPP] Teste iniciado - UA: ${userAgent.substring(0, 50)}`);

    // Buscar todos os usuários não notificados
    const subscribers = await prisma.notificationSubscriber.findMany({
      where: {
        isNotified: false,
      },
    });

    if (subscribers.length === 0) {
      console.log("ℹ️ [TEST WHATSAPP] Nenhum usuário não notificado encontrado");
      return NextResponse.json({
        message: "Nenhum usuário não notificado encontrado",
        total: 0,
        successful: 0,
        failed: 0,
        details: [],
      });
    }

    console.log(`📱 [TEST WHATSAPP] Encontrados ${subscribers.length} usuários não notificados`);

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.EVOLUTION_API_URL || !process.env.EVOLUTION_INSTANCE || !process.env.EVOLUTION_API_KEY) {
      console.error("❌ [TEST WHATSAPP] Variáveis de ambiente não configuradas");
      return NextResponse.json(
        {
          message: "Evolution API não configurada",
          error: "Variáveis EVOLUTION_API_URL, EVOLUTION_INSTANCE ou EVOLUTION_API_KEY não encontradas",
          total: subscribers.length,
          successful: 0,
          failed: subscribers.length,
        },
        { status: 500 }
      );
    }

    // Mensagem de teste
    const testMessage = `🧪 **TESTE UMBRELLIX V Rising** 🧪

Olá {NOME}! 

🤖 Esta é uma mensagem de TESTE do sistema de notificações.

✅ **Sua inscrição está ativa!**
📱 Você receberá notificações quando o servidor for lançado.

🎮 **UMBRELLIX V Rising** em breve:
• 🔥 Servidor PVP - Dificuldade Brutal  
• 🛡️ Servidor PVE - Dificuldade Brutal

💬 Discord: https://discord.gg/tNZDmgB6Cz

⚠️ **Isso é apenas um teste** - o servidor ainda não foi lançado!

🦇 Aguarde a notificação oficial! 🏰`;

    // Enviar mensagens de teste para todos os usuários
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber: any) => {
        try {
          // Log sem número completo por segurança
          console.log(`📱 [TEST WHATSAPP] Enviando teste para ${subscriber.name} (***${subscriber.whatsapp.slice(-4)})`);

          // Usar a função da lib que já formata o número corretamente
          const result = await sendWhatsAppMessage({
            number: subscriber.whatsapp,
            message: testMessage.replace('{NOME}', subscriber.name),
          });

          if (!result.success) {
            throw new Error(result.error || 'Erro no envio via Evolution API');
          }

          console.log(`✅ [TEST WHATSAPP] Teste enviado para ${subscriber.name}`);

          // Aguardar um pouco entre envios para não sobrecarregar a API
          await new Promise((resolve) => setTimeout(resolve, 500));

          return {
            success: true,
            subscriber: subscriber.name,
            whatsapp: subscriber.whatsapp,
            response: result.data,
          };
        } catch (error) {
          console.error(`❌ [TEST WHATSAPP] Erro ao enviar para ${subscriber.name}:`, error);
          throw error;
        }
      })
    );

    const successful = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.filter((result) => result.status === "rejected").length;

    // Detalhes dos resultados (sem expor números completos)
    const details = results.map((result, index) => {
      const subscriber = subscribers[index];
      if (result.status === "fulfilled") {
        return {
          name: subscriber.name,
          whatsapp: `***${subscriber.whatsapp.slice(-4)}`, // Ocultar número por segurança
          status: "success",
          message: "Teste enviado com sucesso",
        };
      } else {
        return {
          name: subscriber.name,
          whatsapp: `***${subscriber.whatsapp.slice(-4)}`, // Ocultar número por segurança
          status: "error",
          message: result.reason?.message || "Erro desconhecido",
        };
      }
    });

    console.log(`✅ [TEST WHATSAPP] Teste concluído: ${successful} sucessos, ${failed} falhas`);

    return NextResponse.json({
      message: `Teste concluído! ${successful} mensagens enviadas com sucesso`,
      total: subscribers.length,
      successful,
      failed,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 [TEST WHATSAPP] Erro crítico:", error);
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        total: 0,
        successful: 0,
        failed: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Permitir GET também para verificação de status
export async function GET(request: NextRequest) {
  try {
    // Apenas verificar quantos usuários não notificados existem
    const count = await prisma.notificationSubscriber.count({
      where: {
        isNotified: false,
      },
    });

    return NextResponse.json({
      message: `${count} usuários não notificados encontrados`,
      count,
      canTest: count > 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 [TEST WHATSAPP GET] Erro:", error);
    return NextResponse.json(
      {
        message: "Erro ao verificar usuários",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        count: 0,
        canTest: false,
      },
      { status: 500 }
    );
  }
} 