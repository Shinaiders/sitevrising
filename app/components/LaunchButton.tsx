'use client';

import { useState } from 'react';
import { useClarity } from '@/app/hooks/useClarity';

export default function LaunchButton() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchResult, setLaunchResult] = useState<any>(null);
  const clarity = useClarity();

  const launchServer = async () => {
    setIsLaunching(true);
    setLaunchResult(null);
    clarity.event('manual_server_launch_clicked');
    
    try {
      console.log('🚀 [LAUNCH] Iniciando lançamento manual do servidor...');
      
      const response = await fetch('/api/notifications/send-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [LAUNCH] Sucesso:', data);
        
        setLaunchResult({
          type: 'success',
          message: `🚀 Servidor lançado! ${data.successful} notificações enviadas`,
          details: `Total: ${data.total}, Sucessos: ${data.successful}, Falhas: ${data.failed}`,
          timestamp: new Date().toLocaleTimeString('pt-BR')
        });
        
        clarity.event('manual_server_launch_success');
        clarity.set('launch_notifications_sent', data.successful?.toString() || '0');
      } else {
        const errorData = await response.json();
        console.error('❌ [LAUNCH] Erro:', errorData);
        
        setLaunchResult({
          type: 'error',
          message: '❌ Falha no lançamento',
          details: errorData.message || 'Erro desconhecido',
          timestamp: new Date().toLocaleTimeString('pt-BR')
        });
        
        clarity.event('manual_server_launch_error');
      }
    } catch (error) {
      console.error('💥 [LAUNCH] Erro crítico:', error);
      
      setLaunchResult({
        type: 'error',
        message: '❌ Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toLocaleTimeString('pt-BR')
      });
      
      clarity.event('manual_server_launch_error');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-red-400 mb-2">
          🚀 Lançamento do Servidor
        </h3>
        <p className="text-red-200 text-sm">
          Clique para lançar o servidor e enviar notificações para todos os inscritos
        </p>
      </div>

      {/* Botão de Lançamento */}
      <div className="text-center mb-6">
        <button
          onClick={launchServer}
          disabled={isLaunching}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 disabled:cursor-not-allowed text-lg"
        >
          {isLaunching ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Lançando Servidor...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>LANÇAR SERVIDOR AGORA</span>
            </div>
          )}
        </button>
      </div>

      {/* Resultado do Lançamento */}
      {launchResult && (
        <div className="bg-black/30 border border-gray-500/30 rounded-lg p-4">
          <div className="text-center">
            <div
              className={`p-4 rounded-lg border ${
                launchResult.type === 'success' 
                  ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                  : 'bg-red-900/20 border-red-500/30 text-red-400'
              }`}
            >
              <div className="font-bold text-lg mb-2">{launchResult.message}</div>
              <div className="text-sm opacity-80 mb-2">{launchResult.details}</div>
              <div className="text-xs opacity-60">Horário: {launchResult.timestamp}</div>
            </div>
          </div>
        </div>
      )}

      {/* Aviso Importante */}
      <div className="mt-6 text-xs text-gray-400 space-y-1 text-center">
        <div>⚠️ <strong>ATENÇÃO:</strong> Este botão enviará notificações para TODOS os inscritos</div>
        <div>📱 Certifique-se de que o servidor está realmente pronto antes de clicar</div>
        <div>🔄 Use apenas quando for oficialmente lançar o servidor</div>
      </div>
    </div>
  );
} 