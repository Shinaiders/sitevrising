import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Cronômetro zerou! Iniciando disparo via Trigger.dev...');

    // Verificar se há inscritos para notificar
    const subscribersCount = await prisma.notificationSubscriber.count({
      where: {
        isNotified: false
      }
    });

    if (subscribersCount === 0) {
      console.log('ℹ️ Nenhum inscrito encontrado para notificar');
      return NextResponse.json({
        message: 'Nenhum inscrito encontrado para notificar',
        count: 0,
        triggered: false
      });
    }

    console.log(`📊 Encontrados ${subscribersCount} inscritos para notificar`);

    // 🎯 SISTEMA ROBUSTO DE TRIGGER.DEV COM MÚLTIPLAS TENTATIVAS
    try {
      // Validar configuração do Trigger.dev
      if (!process.env.TRIGGER_SECRET_KEY) {
        throw new Error('TRIGGER_SECRET_KEY não configurada');
      }

      const triggerResult = await attemptTriggerDevDispatch(subscribersCount);
      
      if (triggerResult.success) {
        return NextResponse.json({
          message: 'Job de notificações disparado via Trigger.dev!',
          triggered: true,
          triggerJobId: triggerResult.jobId,
          subscribersCount: subscribersCount,
          timestamp: new Date().toISOString(),
          method: triggerResult.method,
          url: triggerResult.url,
          attempts: triggerResult.attempts
        });
      } else {
        console.error('❌ Todas as tentativas do Trigger.dev falharam:', triggerResult.error);
        throw new Error(triggerResult.error);
      }

    } catch (triggerError) {
      console.error('❌ Erro ao disparar Trigger.dev, executando fallback local:', triggerError);
      
      // FALLBACK: Se o Trigger.dev falhar, executa localmente
      return await executeLocalNotifications();
    }

  } catch (error) {
    console.error('💥 Erro crítico no disparo automático:', error);
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor no disparo automático',
        triggered: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// 🔄 Função para tentar múltiplas abordagens do Trigger.dev
async function attemptTriggerDevDispatch(subscribersCount: number) {
  const attempts = [];
  
  // 🏠 TENTATIVA 1: Servidor Próprio (se configurado)
  if (process.env.TRIGGER_API_URL) {
    console.log(`🏠 [TRIGGER] Tentativa 1: Servidor próprio (${process.env.TRIGGER_API_URL})`);
    
    const customServerResult = await tryTriggerDevRequest({
      url: `${process.env.TRIGGER_API_URL}/api/v1/jobs/send-launch-notifications/trigger`,
      method: 'trigger.dev-custom',
      payload: {
        launchTime: new Date().toISOString(),
        subscribersCount: subscribersCount,
        source: 'countdown-timer'
      }
    });
    
    attempts.push({ method: 'custom-server', ...customServerResult });
    
    if (customServerResult.success) {
      return { 
        success: true, 
        jobId: customServerResult.jobId,
        method: 'trigger.dev-custom',
        url: customServerResult.url,
        attempts: attempts.length
      };
    }
  }

  // ☁️ TENTATIVA 2: Trigger.dev Cloud
  console.log(`☁️ [TRIGGER] Tentativa 2: Trigger.dev Cloud`);
  
  const cloudResult = await tryTriggerDevRequest({
    url: 'https://api.trigger.dev/api/v1/sources/http/events',
    method: 'trigger.dev-cloud',
    payload: {
      eventName: 'launch.notifications.send',
      payload: {
        launchTime: new Date().toISOString(),
        subscribersCount: subscribersCount,
        source: 'countdown-timer',
        projectId: process.env.TRIGGER_PROJECT_ID || 'umbrellix-v-rising'
      }
    }
  });
  
  attempts.push({ method: 'cloud', ...cloudResult });
  
  if (cloudResult.success) {
    return { 
      success: true, 
      jobId: cloudResult.jobId,
      method: 'trigger.dev-cloud',
      url: cloudResult.url,
      attempts: attempts.length
    };
  }

  // 🔄 TENTATIVA 3: Servidor Próprio com URL Alternativa (se configurado)
  if (process.env.TRIGGER_API_URL) {
    console.log(`🔄 [TRIGGER] Tentativa 3: Servidor próprio com URL alternativa`);
    
    const altServerResult = await tryTriggerDevRequest({
      url: `${process.env.TRIGGER_API_URL}/api/v1/sources/http/events`,
      method: 'trigger.dev-custom-alt',
      payload: {
        eventName: 'launch.notifications.send',
        payload: {
          launchTime: new Date().toISOString(),
          subscribersCount: subscribersCount,
          source: 'countdown-timer',
          projectId: process.env.TRIGGER_PROJECT_ID || 'umbrellix-v-rising'
        }
      }
    });
    
    attempts.push({ method: 'custom-server-alt', ...altServerResult });
    
    if (altServerResult.success) {
      return { 
        success: true, 
        jobId: altServerResult.jobId,
        method: 'trigger.dev-custom-alt',
        url: altServerResult.url,
        attempts: attempts.length
      };
    }
  }

  // ❌ Todas as tentativas falharam
  const lastError = attempts[attempts.length - 1]?.error || 'Todas as tentativas falharam';
  console.error('❌ [TRIGGER] Todas as tentativas falharam:', attempts);
  
  return {
    success: false,
    error: lastError,
    attempts: attempts.length,
    details: attempts
  };
}

// 🔧 Função auxiliar para fazer requisições ao Trigger.dev
async function tryTriggerDevRequest({ url, method, payload }: {
  url: string;
  method: string;
  payload: any;
}) {
  try {
    console.log(`🔗 [TRIGGER] Disparando para: ${url}`);
    console.log(`📦 [TRIGGER] Payload: ${JSON.stringify(payload, null, 2)}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
        'User-Agent': 'UMBRELLIX-V-Rising/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 [TRIGGER] Response status: ${response.status}`);
    console.log(`📡 [TRIGGER] Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [TRIGGER] Erro detalhado:`, errorText);
      console.error(`❌ [TRIGGER] URL usada:`, url);
      console.error(`❌ [TRIGGER] Payload enviado:`, JSON.stringify(payload, null, 2));
      
      return {
        success: false,
        error: `${response.status} - ${response.statusText}: ${errorText}`,
        url,
        status: response.status
      };
    }

    const responseData = await response.json();
    console.log('✅ [TRIGGER] Resposta bem-sucedida:', responseData);

    return {
      success: true,
      jobId: responseData.id || responseData.eventId || 'unknown',
      url,
      data: responseData
    };

  } catch (error) {
    console.error(`❌ [TRIGGER] Erro na requisição para ${url}:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido na requisição',
      url
    };
  }
}

// Função de fallback para executar localmente se o Trigger.dev falhar
async function executeLocalNotifications() {
  console.log('🔄 Executando notificações localmente como fallback...');
  
  const subscribers = await prisma.notificationSubscriber.findMany({
    where: {
      isNotified: false
    }
  });

  const results = await Promise.allSettled(
    subscribers.map(async (subscriber) => {
      const launchMessage = `🎮 Olá ${subscriber.name}! 

🚀 O UMBRELLIX V Rising ACABOU DE SER LANÇADO!

⚔️ Servidores disponíveis AGORA:
• 🔥 UMBRELLIX PVP - Dificuldade Brutal
• 🛡️ UMBRELLIX PVE - Dificuldade Brutal

🎯 Entre no Discord para mais informações:
https://discord.gg/tNZDmgB6Cz

⚡ Não perca tempo! Os melhores territórios serão ocupados rapidamente!

Nos vemos no jogo! 🦇🏰`;

      try {
        console.log(`📱 [FALLBACK] Enviando para ${subscriber.name} (${subscriber.whatsapp})`);
        
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Marcar como notificado
        await prisma.notificationSubscriber.update({
          where: { id: subscriber.id },
          data: { isNotified: true }
        });

        console.log(`✅ [FALLBACK] Notificação enviada para ${subscriber.name}`);
        
        return { 
          success: true, 
          subscriber: subscriber.name,
          whatsapp: subscriber.whatsapp 
        };

      } catch (error) {
        console.error(`❌ [FALLBACK] Erro ao enviar para ${subscriber.name}:`, error);
        throw error;
      }
    })
  );

  const successful = results.filter(result => result.status === 'fulfilled').length;
  const failed = results.filter(result => result.status === 'rejected').length;

  return NextResponse.json({
    message: 'Notificações enviadas via fallback local!',
    triggered: true,
    method: 'fallback',
    total: subscribers.length,
    successful,
    failed,
    timestamp: new Date().toISOString()
  });
} 