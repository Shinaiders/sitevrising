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

  // Teste local de notificações
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

      <div className="space-y-4">
        {/* Teste Local */}
        <button
          onClick={testLocalNotifications}
          disabled={isTestingLocal}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isTestingLocal ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testando...
            </span>
          ) : (
            '📧 Teste Local'
          )}
        </button>

        {/* Teste WhatsApp */}
        <button
          onClick={testWhatsAppWithUsers}
          disabled={isTestingWhatsApp}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isTestingWhatsApp ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testando...
            </span>
          ) : (
            '📱 Teste WhatsApp'
          )}
        </button>

        {/* Teste Evolution API */}
        <button
          onClick={testEvolutionAPI}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          📱 Teste Evolution API
        </button>
      </div>

      {/* Resultados dos Testes */}
      {showResults && testResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-purple-300">
              📊 Resultados dos Testes
            </h4>
            <button
              onClick={clearResults}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
            >
              Limpar
            </button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  result.type === 'success'
                    ? 'bg-green-900/30 border-green-500 text-green-200'
                    : result.type === 'warning'
                    ? 'bg-yellow-900/30 border-yellow-500 text-yellow-200'
                    : 'bg-red-900/30 border-red-500 text-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{result.message}</p>
                    {result.details && (
                      <p className="text-xs opacity-80 mt-1">{result.details}</p>
                    )}
                  </div>
                  <span className="text-xs opacity-60 ml-2">{result.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
        <p className="text-xs text-blue-200">
          💡 <strong>Dica:</strong> Use estes testes para verificar se o sistema de notificações está funcionando corretamente. 
          O teste local envia notificações diretamente, enquanto o teste WhatsApp verifica a integração com a Evolution API.
        </p>
      </div>
    </div>
  );
} 