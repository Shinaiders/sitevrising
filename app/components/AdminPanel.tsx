'use client';

import { useState, useEffect } from 'react';
import { useClarity } from '@/app/hooks/useClarity';
import TestNotificationButton from './TestNotificationButton';
import LaunchButton from './LaunchButton';

interface Subscriber {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
  isNotified: boolean;
}

interface Stats {
  total: number;
  notified: number;
  pending: number;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, notified: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const clarity = useClarity();

  // Verificar se já está autenticado no localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Função de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Senha simples para acesso administrativo
    const adminPassword = 'umbrellix2024'; // Você pode mudar esta senha
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
      clarity.event('admin_login_success');
      console.log('✅ [ADMIN] Login realizado com sucesso');
    } else {
      setLoginError('Senha incorreta');
      clarity.event('admin_login_failed');
      console.log('❌ [ADMIN] Tentativa de login falhada');
    }
    
    setPassword('');
  };

  // Função de logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setSubscribers([]);
    setStats({ total: 0, notified: 0, pending: 0 });
    clarity.event('admin_logout');
    console.log('🚪 [ADMIN] Logout realizado');
  };

  const loadSubscribers = async () => {
    setIsLoading(true);
    clarity.event('admin_load_subscribers');
    
    try {
      const response = await fetch('/api/notifications/list');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
        setStats(data.stats);
        setMessage('✅ Dados carregados com sucesso!');
        console.log('📊 [ADMIN] Dados carregados:', data.stats);
      } else {
        setMessage('❌ Erro ao carregar dados');
      }
    } catch (error) {
      console.error('Erro ao carregar inscritos:', error);
      setMessage('❌ Erro de conexão');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const sendNotifications = async () => {
    setIsSending(true);
    clarity.event('admin_send_notifications_manual');
    
    try {
      const response = await fetch('/api/notifications/send-all', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ ${data.successful} notificações enviadas com sucesso!`);
        clarity.event('admin_notifications_sent_success');
        clarity.set('admin_notifications_count', data.successful.toString());
        
        // Recarregar dados
        await loadSubscribers();
      } else {
        const errorData = await response.json();
        setMessage(`❌ Erro: ${errorData.message}`);
        clarity.event('admin_notifications_sent_error');
      }
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      setMessage('❌ Erro de conexão');
      clarity.event('admin_notifications_sent_error');
    } finally {
      setIsSending(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const testWhatsApp = async () => {
    clarity.event('admin_test_whatsapp');
    
    try {
      const response = await fetch('/api/test-whatsapp', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Teste WhatsApp: ${data.message}`);
        clarity.event('admin_whatsapp_test_success');
      } else {
        const errorData = await response.json();
        setMessage(`❌ Erro no teste: ${errorData.message}`);
        clarity.event('admin_whatsapp_test_error');
      }
    } catch (error) {
      console.error('Erro no teste WhatsApp:', error);
      setMessage('❌ Erro de conexão no teste');
      clarity.event('admin_whatsapp_test_error');
    } finally {
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Se não estiver autenticado, mostrar formulário de login
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-300 mb-2">
            🔒 Acesso Administrativo
          </h3>
          <p className="text-gray-400">
            Digite a senha para acessar o painel administrativo
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-2">
              Senha de Administrador
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className="w-full px-4 py-3 bg-black/50 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              required
            />
            {loginError && (
              <p className="text-red-400 text-sm mt-1">{loginError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            🔓 Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Acesso restrito apenas para administradores
          </p>
        </div>
      </div>
    );
  }

  // Painel administrativo autenticado
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-blue-500/50 rounded-xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-3xl font-bold text-blue-400 mb-2">
            🛠️ Painel Administrativo
          </h3>
          <p className="text-blue-200">
            Gerencie notificações e monitore inscrições
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
        >
          🚪 Sair
        </button>
      </div>

      {/* Aviso de Produção */}
      {process.env.NODE_ENV === 'production' && (
        <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚀</div>
            <div>
              <div className="font-bold text-orange-400">Modo Produção Ativo</div>
              <div className="text-sm text-orange-200">
                ⚠️ As notificações serão enviadas para usuários reais! Use o centro de testes com cuidado.
              </div>
              <div className="text-xs text-orange-300 mt-1">
                📅 Verifique se a data do cronômetro está correta antes do lançamento oficial.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Painel Principal */}
      <div className="space-y-8">
        {/* Botão de Lançamento do Servidor */}
        <LaunchButton />

        {/* Centro de Testes */}
        <TestNotificationButton />

        {/* Estatísticas */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/50 rounded-xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-blue-200">Total de Inscritos</div>
            </div>
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.notified}</div>
              <div className="text-sm text-green-200">Já Notificados</div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-yellow-200">Pendentes</div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={loadSubscribers}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Carregando...
              </div>
            ) : (
              '📊 Carregar Dados'
            )}
          </button>

          <button
            onClick={sendNotifications}
            disabled={isSending || stats.pending === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Enviando...
              </div>
            ) : (
              '📱 Enviar Notificações'
            )}
          </button>

          <button
            onClick={testWhatsApp}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            🧪 Testar WhatsApp
          </button>
        </div>

        {/* Mensagem de Status */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') 
              ? 'bg-green-900/30 border border-green-500/50 text-green-400' 
              : 'bg-red-900/30 border border-red-500/50 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Lista de Inscritos */}
        {subscribers.length > 0 && (
          <div className="bg-black/30 border border-gray-500/30 rounded-lg p-6">
            <h4 className="text-xl font-bold text-gray-300 mb-4">
              📋 Lista de Inscritos ({subscribers.length})
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    subscriber.isNotified 
                      ? 'bg-green-900/20 border border-green-500/30' 
                      : 'bg-yellow-900/20 border border-yellow-500/30'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{subscriber.name}</div>
                    <div className="text-sm text-gray-400">
                      📱 Original: {subscriber.whatsapp}
                    </div>
                    <div className="text-sm text-blue-400">
                      🌍 Formatado: {subscriber.whatsapp.replace(/\D/g, '').startsWith('55') 
                        ? subscriber.whatsapp.replace(/\D/g, '') 
                        : `55${subscriber.whatsapp.replace(/\D/g, '')}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(subscriber.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      subscriber.isNotified 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {subscriber.isNotified ? '✅ Notificado' : '⏳ Pendente'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {subscriber.whatsapp.replace(/\D/g, '').length} dígitos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Painel restrito - Acesso apenas para administradores
        </p>
      </div>
    </div>
  );
} 