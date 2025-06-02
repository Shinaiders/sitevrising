import * as cron from 'node-cron';

let isSchedulerRunning = false;
let scheduledTask: any = null;

export function startNotificationScheduler() {
  if (isSchedulerRunning) {
    console.log('📅 [SCHEDULER] Agendador já está rodando');
    return;
  }

  console.log('🚀 [SCHEDULER] Iniciando agendador de notificações...');

  // Verificar a cada minuto se é hora de enviar notificações
  scheduledTask = cron.schedule('* * * * *', async () => {
    try {
      console.log('⏰ [SCHEDULER] Verificando se é hora de lançar...');
      
      const response = await fetch('http://localhost:3000/api/cron/check-launch', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.launched) {
          console.log(`✅ [SCHEDULER] Notificações enviadas: ${data.successful}/${data.total}`);
        } else {
          console.log(`ℹ️ [SCHEDULER] ${data.message}`);
        }
      } else {
        console.error('❌ [SCHEDULER] Erro na verificação:', response.status);
      }
    } catch (error) {
      console.error('💥 [SCHEDULER] Erro crítico:', error);
    }
  });

  isSchedulerRunning = true;
  console.log('✅ [SCHEDULER] Agendador iniciado com sucesso!');
}

export function stopNotificationScheduler() {
  if (!isSchedulerRunning || !scheduledTask) {
    console.log('📅 [SCHEDULER] Agendador já está parado');
    return;
  }

  scheduledTask.destroy();
  scheduledTask = null;
  isSchedulerRunning = false;
  console.log('🛑 [SCHEDULER] Agendador parado');
} 