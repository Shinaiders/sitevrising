'use client';

import { useState } from 'react';
import { useClarity } from '@/app/hooks/useClarity';

interface TestResult {
  type: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  timestamp: string;
}

export default function TestNotificationButton() {
  const [isTestingLocal, setIsTestingLocal] = useState(false);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const clarity = useClarity();

  const addTestResult = (result: Omit<TestResult, 'timestamp'>) => {
    const newResult: TestResult = {
      ...result,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };
    setTestResults(prev => [newResult, ...prev.slice(0, 4)]); // Manter apenas os 5 últimos
    setShowResults(true);
  };

  // Teste local (sem Trigger.dev)
  const testLocalNotifications = async () => {
    setIsTestingLocal(true);
    clarity.event('test_local_notifications_clicked');
    
    try {
      console.log('🧪 [TESTE LOCAL] Iniciando teste de notificações locais...');
      
      const response = await fetch('/api/notifications/send-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [TESTE LOCAL] Sucesso:', data);
        
        addTestResult({
          type: 'success',
          message: `Teste Local: ${data.successful} notificações enviadas`,
          details: `Total: ${data.total}, Sucessos: ${data.successful}, Falhas: ${data.failed}`
        });
        
        clarity.event('test_local_notifications_success');
        clarity.set('test_local_count', data.successful?.toString() || '0');
      } else {
        const errorData = await response.json();
        console.error('❌ [TESTE LOCAL] Erro:', errorData);
        
        addTestResult({
          type: 'error',
          message: 'Teste Local: Falhou',
          details: errorData.message || 'Erro desconhecido'
        });
        
        clarity.event('test_local_notifications_error');
      }
    } catch (error) {
      console.error('💥 [TESTE LOCAL] Erro crítico:', error);
      
      addTestResult({
        type: 'error',
        message: 'Teste Local: Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      clarity.event('test_local_notifications_error');
    } finally {
      setIsTestingLocal(false);
    }
  };

  // Teste WhatsApp com usuários não notificados
  const testWhatsAppWithUsers = async () => {
    setIsTestingWhatsApp(true);
    clarity.event('test_whatsapp_with_users_clicked');
    
    try {
      console.log('📱 [TESTE WHATSAPP] Testando com usuários não notificados...');
      
      const response = await fetch('/api/test-whatsapp-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [TESTE WHATSAPP] Sucesso:', data);
        
        addTestResult({
          type: 'success',
          message: `Teste WhatsApp: ${data.successful} mensagens enviadas`,
          details: `Total encontrados: ${data.total}, Sucessos: ${data.successful}, Falhas: ${data.failed}`
        });
        
        clarity.event('test_whatsapp_with_users_success');
        clarity.set('test_whatsapp_count', data.successful?.toString() || '0');
      } else {
        const errorData = await response.json();
        console.error('❌ [TESTE WHATSAPP] Erro:', errorData);
        
        addTestResult({
          type: 'error',
          message: 'Teste WhatsApp: Falhou',
          details: errorData.message || 'Erro desconhecido'
        });
        
        clarity.event('test_whatsapp_with_users_error');
      }
    } catch (error) {
      console.error('💥 [TESTE WHATSAPP] Erro crítico:', error);
      
      addTestResult({
        type: 'error',
        message: 'Teste WhatsApp: Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      clarity.event('test_whatsapp_with_users_error');
    } finally {
      setIsTestingWhatsApp(false);
    }
  };

  // Teste da Evolution API
  const testEvolutionAPI = async () => {
    clarity.event('test_evolution_api_clicked');
    
    try {
      console.log('📱 [TESTE EVOLUTION] Testando Evolution API...');
      
      const response = await fetch('/api/test-whatsapp', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [TESTE EVOLUTION] Sucesso:', data);
        
        addTestResult({
          type: 'success',
          message: 'Teste Evolution API: Configuração OK',
          details: data.message
        });
        
        clarity.event('test_evolution_api_success');
      } else {
        const errorData = await response.json();
        console.error('❌ [TESTE EVOLUTION] Erro:', errorData);
        
        addTestResult({
          type: 'error',
          message: 'Teste Evolution API: Falhou',
          details: errorData.message || 'Erro de configuração'
        });
        
        clarity.event('test_evolution_api_error');
      }
    } catch (error) {
      console.error('💥 [TESTE EVOLUTION] Erro crítico:', error);
      
      addTestResult({
        type: 'error',
        message: 'Teste Evolution API: Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      clarity.event('test_evolution_api_error');
    }
  };

  // Limpar resultados
  const clearResults = () => {
    setTestResults([]);
    setShowResults(false);
    clarity.event('test_results_cleared');
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/50 rounded-xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-purple-400 mb-2">
          🧪 Centro de Testes
        </h3>
        <p className="text-purple-200 text-sm">
          Teste o sistema de notificações e integração WhatsApp
        </p>
      </div>

      {/* Botões de Teste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testLocalNotifications}
          disabled={isTestingLocal}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          {isTestingLocal ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-sm">Testando...</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg mb-1">📧</div>
              <div className="text-sm">Teste Local</div>
            </div>
          )}
        </button>

        <button
          onClick={testWhatsAppWithUsers}
          disabled={isTestingWhatsApp}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          {isTestingWhatsApp ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-sm">Enviando...</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg mb-1">💬</div>
              <div className="text-sm">Teste WhatsApp</div>
              <div className="text-xs opacity-80">c/ usuários</div>
            </div>
          )}
        </button>

        <button
          onClick={testEvolutionAPI}
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
          <div className="text-center">
            <div className="text-lg mb-1">⚙️</div>
            <div className="text-sm">Config API</div>
          </div>
        </button>
      </div>

      {/* Resultados dos Testes */}
      {showResults && testResults.length > 0 && (
        <div className="bg-black/30 border border-gray-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-bold text-gray-300">
              📊 Resultados dos Testes
            </h4>
            <button
              onClick={clearResults}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              🗑️ Limpar
            </button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.type === 'success' 
                    ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                    : result.type === 'warning'
                    ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
                    : 'bg-red-900/20 border-red-500/30 text-red-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{result.message}</div>
                    {result.details && (
                      <div className="text-xs opacity-80 mt-1">{result.details}</div>
                    )}
                  </div>
                  <div className="text-xs opacity-60 ml-2">{result.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações dos Testes */}
      <div className="mt-6 text-xs text-gray-400 space-y-1">
        <div>• <strong>Teste Local:</strong> Envia notificações diretamente via API</div>
        <div>• <strong>Teste WhatsApp:</strong> Envia mensagens de teste para usuários não notificados</div>
        <div>• <strong>Config API:</strong> Verifica se a Evolution API está configurada</div>
        <div>• <strong>Lançamento:</strong> Use o botão vermelho acima para lançar oficialmente</div>
      </div>
    </div>
  );
} 