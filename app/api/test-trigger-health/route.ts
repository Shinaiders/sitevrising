import { NextRequest, NextResponse } from 'next/server';

interface HealthCheckDetails {
  [key: string]: any;
}

interface HealthCheck {
  name: string;
  status: 'checking' | 'success' | 'warning' | 'error';
  url?: string;
  details: HealthCheckDetails;
}

export async function POST(request: NextRequest) {
  const healthChecks: HealthCheck[] = [];
  
  console.log('🔍 [HEALTH CHECK] Iniciando verificação de saúde do Trigger.dev...');

  // 1. Verificar variáveis de ambiente
  const envCheck: HealthCheck = {
    name: 'Variáveis de Ambiente',
    status: 'checking',
    details: {}
  };

  if (!process.env.TRIGGER_SECRET_KEY) {
    envCheck.status = 'error';
    envCheck.details = { error: 'TRIGGER_SECRET_KEY não configurada' };
  } else {
    envCheck.status = 'success';
    envCheck.details = { 
      hasSecretKey: true,
      hasApiUrl: !!process.env.TRIGGER_API_URL,
      hasProjectId: !!process.env.TRIGGER_PROJECT_ID
    };
  }
  
  healthChecks.push(envCheck);

  // 2. Testar servidor próprio (se configurado)
  if (process.env.TRIGGER_API_URL) {
    const customServerCheck: HealthCheck = {
      name: 'Servidor Próprio',
      status: 'checking',
      url: process.env.TRIGGER_API_URL,
      details: {}
    };

    try {
      // Testar conectividade básica
      const healthUrl = `${process.env.TRIGGER_API_URL}/health`;
      console.log(`🏠 [HEALTH] Testando conectividade: ${healthUrl}`);
      
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
        },
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      });

      if (healthResponse.ok) {
        customServerCheck.status = 'success';
        customServerCheck.details = { 
          connectivity: 'ok',
          status: healthResponse.status 
        };
      } else {
        customServerCheck.status = 'warning';
        customServerCheck.details = { 
          connectivity: 'limited',
          status: healthResponse.status,
          message: 'Servidor responde mas pode ter problemas'
        };
      }

      // Testar se jobs existem
      try {
        const jobsUrl = `${process.env.TRIGGER_API_URL}/api/v1/jobs`;
        console.log(`🏠 [HEALTH] Testando jobs: ${jobsUrl}`);
        
        const jobsResponse = await fetch(jobsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
          },
          signal: AbortSignal.timeout(5000)
        });

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          const hasLaunchJob = jobsData.some((job: any) => job.id === 'send-launch-notifications');
          
          customServerCheck.details.jobsAvailable = jobsData.length;
          customServerCheck.details.hasLaunchJob = hasLaunchJob;
          
          if (!hasLaunchJob) {
            customServerCheck.status = 'warning';
            customServerCheck.details.warning = 'Job send-launch-notifications não encontrado';
          }
        }
      } catch (jobError) {
        customServerCheck.details.jobsError = 'Não foi possível verificar jobs';
      }

    } catch (error) {
      customServerCheck.status = 'error';
      customServerCheck.details = { 
        error: error instanceof Error ? error.message : 'Erro de conectividade',
        connectivity: 'failed'
      };
    }

    healthChecks.push(customServerCheck);
  }

  // 3. Testar Trigger.dev Cloud
  const cloudCheck: HealthCheck = {
    name: 'Trigger.dev Cloud',
    status: 'checking',
    url: 'https://api.trigger.dev',
    details: {}
  };

  try {
    // Testar conectividade com Trigger.dev Cloud
    console.log('☁️ [HEALTH] Testando Trigger.dev Cloud...');
    
    const cloudResponse = await fetch('https://api.trigger.dev/api/v1/sources/http/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
      },
      body: JSON.stringify({
        eventName: 'health.check',
        payload: { test: true, timestamp: new Date().toISOString() }
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (cloudResponse.ok) {
      cloudCheck.status = 'success';
      cloudCheck.details = { 
        connectivity: 'ok',
        status: cloudResponse.status,
        message: 'Trigger.dev Cloud está funcionando'
      };
    } else if (cloudResponse.status === 401) {
      cloudCheck.status = 'error';
      cloudCheck.details = { 
        error: 'Chave de API inválida para Trigger.dev Cloud',
        status: cloudResponse.status
      };
    } else {
      cloudCheck.status = 'warning';
      cloudCheck.details = { 
        warning: 'Trigger.dev Cloud com problemas',
        status: cloudResponse.status
      };
    }

  } catch (error) {
    cloudCheck.status = 'error';
    cloudCheck.details = { 
      error: error instanceof Error ? error.message : 'Erro de conectividade com cloud',
      connectivity: 'failed'
    };
  }

  healthChecks.push(cloudCheck);

  // 4. Resumo geral
  const hasSuccess = healthChecks.some(check => check.status === 'success');
  const hasErrors = healthChecks.some(check => check.status === 'error');
  
  const overallStatus = hasSuccess ? (hasErrors ? 'partial' : 'healthy') : 'unhealthy';

  console.log('📊 [HEALTH] Verificação concluída:', { overallStatus, checks: healthChecks.length });

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks: healthChecks,
    recommendations: generateRecommendations(healthChecks)
  });
}

function generateRecommendations(checks: HealthCheck[]) {
  const recommendations = [];

  const envCheck = checks.find(c => c.name === 'Variáveis de Ambiente');
  if (envCheck?.status === 'error') {
    recommendations.push({
      type: 'critical',
      message: 'Configure TRIGGER_SECRET_KEY no arquivo .env',
      action: 'Adicione TRIGGER_SECRET_KEY="tr_dev_sua_chave_aqui" no .env'
    });
  }

  const customCheck = checks.find(c => c.name === 'Servidor Próprio');
  if (customCheck?.status === 'error') {
    recommendations.push({
      type: 'warning',
      message: 'Servidor próprio inacessível',
      action: 'Verifique se https://trigger.ricioconsultas.com.br está online'
    });
  }

  if (customCheck?.details?.hasLaunchJob === false) {
    recommendations.push({
      type: 'warning',
      message: 'Job send-launch-notifications não encontrado no servidor próprio',
      action: 'Execute: npx trigger.dev@latest deploy --endpoint https://trigger.ricioconsultas.com.br'
    });
  }

  const cloudCheck = checks.find(c => c.name === 'Trigger.dev Cloud');
  if (cloudCheck?.status === 'error' && cloudCheck?.details?.status === 401) {
    recommendations.push({
      type: 'critical',
      message: 'Chave de API inválida para Trigger.dev Cloud',
      action: 'Verifique TRIGGER_SECRET_KEY no dashboard do Trigger.dev'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      message: 'Sistema funcionando corretamente',
      action: 'Nenhuma ação necessária'
    });
  }

  return recommendations;
} 