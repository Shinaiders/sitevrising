'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import NotificationForm from './components/NotificationForm';
import AdminPanel from './components/AdminPanel';
import { useClarity } from './hooks/useClarity';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [hasLaunched, setHasLaunched] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const clarity = useClarity();

  useEffect(() => {
    // Registrar que o usuário visualizou a página
    clarity.event('homepage_viewed');
    
      // Data oficial do lançamento: 13 de Junho de 2025
  const launchDate = new Date('2025-06-13T19:00:00-03:00'); // 19h horário de Brasília

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        
        // Se ainda não lançou, disparar as notificações
        if (!hasLaunched) {
          console.log('🚀 LANÇAMENTO! Disparando notificações automáticas...');
          setHasLaunched(true);
          
          // Registrar evento de lançamento automático
          clarity.event('automatic_launch_triggered');
          clarity.set('launch_triggered', 'automatic');
          
          // Disparar notificações via API
          triggerLaunchNotifications();
        }
        
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hasLaunched]);

  // Função para disparar notificações quando o cronômetro zerar
  const triggerLaunchNotifications = async () => {
    if (isTriggering) return;
    
    setIsTriggering(true);
    
    try {
      const response = await fetch('/api/notifications/trigger-launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('✅ Notificações de lançamento disparadas:', data);
      
      if (data.triggered) {
        console.log(`📊 ${data.successful} notificações enviadas automaticamente!`);
        clarity.event('automatic_notifications_sent');
        clarity.set('auto_notifications_count', data.successful?.toString() || '0');
      }
    } catch (error) {
      console.error('❌ Erro ao disparar notificações automáticas:', error);
      clarity.event('automatic_notifications_error');
    } finally {
      setIsTriggering(false);
    }
  };

  // Função para rastrear clique no Discord
  const handleDiscordClick = () => {
    clarity.event('discord_link_clicked');
    clarity.set('external_link', 'discord');
  };

  // Função para rastrear visualização do cronômetro
  const handleCountdownView = () => {
    clarity.event('countdown_viewed');
    clarity.set('countdown_days', timeLeft.days.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl cursor-pointer"
            onClick={() => clarity.event('logo_clicked')}
          >
            🦇 UMBRELLIX 🏰
          </h1>
          <p className="text-xl md:text-2xl text-red-200 font-semibold">
            Servidor Brasileiro de V Rising - Experiência Épica te Aguarda!
          </p>
        </div>
      </header>

      {/* Countdown Timer */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {hasLaunched ? (
            // Servidor Lançado
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
                🎉 SERVIDOR LANÇADO! 🎉
              </h2>
              <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-8 mb-6">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-green-300 mb-2">
                  UMBRELLIX V Rising está ONLINE!
                </h3>
                <p className="text-green-200 mb-4">
                  Os servidores estão funcionando e prontos para receber jogadores!
                </p>
                {isTriggering ? (
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                    <span>Enviando notificações via WhatsApp...</span>
                  </div>
                ) : (
                  <div className="text-green-400">
                    ✅ Notificações enviadas automaticamente!
                  </div>
                )}
              </div>
              <a
                href="https://discord.gg/tNZDmgB6Cz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleDiscordClick();
                  clarity.event('play_now_button_clicked');
                }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-2xl hover:from-green-700 hover:to-blue-700 transform hover:scale-110 transition-all duration-300"
              >
                <span className="mr-3 text-2xl">🎮</span>
                JOGAR AGORA!
                <span className="ml-3">🚀</span>
              </a>
            </div>
          ) : (
            // Cronômetro
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-red-300">
                🚀 LANÇAMENTO EM:
              </h2>
              <div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                onClick={handleCountdownView}
              >
                {[
                  { label: 'DIAS', value: timeLeft.days },
                  { label: 'HORAS', value: timeLeft.hours },
                  { label: 'MINUTOS', value: timeLeft.minutes },
                  { label: 'SEGUNDOS', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 shadow-2xl animate-pulse-red">
                    <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm md:text-base text-red-200 font-semibold">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-lg text-red-200">
                📅 <strong>13 de Junho de 2025 às 19h</strong> - Prepare-se para a batalha!
              </p>
            </>
          )}
        </div>
      </section>

      {/* Notification Form Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <NotificationForm />
        </div>
      </section>

      {/* Admin Panel Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <AdminPanel />
        </div>
      </section>

      {/* Server Info */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-300">
            ⚔️ Informações dos Servidores
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* PVP Server */}
            <div 
              className="bg-black/60 backdrop-blur-sm border border-red-500/50 rounded-xl p-8 shadow-2xl hover:border-red-400/70 transition-all duration-300 cursor-pointer"
              onClick={() => {
                clarity.event('pvp_server_info_clicked');
                clarity.set('server_type', 'pvp_detailed');
              }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  UMBRELLIX PVP
                </h3>
                <p className="text-red-200">
                  🦇 Servidor de V Rising 🏰
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">🎮 Modo de Jogo:</span>
                  <span className="text-red-400 font-bold">PvP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">⚔️ Dificuldade:</span>
                  <span className="text-red-400 font-bold">Brutal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">🛡️ Proteção PvP:</span>
                  <span className="text-yellow-400 font-bold">Longa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">🔮 Equipamentos Vinculados:</span>
                  <span className="text-green-400 font-bold">Ativado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">🏹 Danos ao Jogador:</span>
                  <span className="text-red-400 font-bold">Sempre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">⏳ Danos ao Castelo:</span>
                  <span className="text-orange-400 font-bold">Restritos</span>
                </div>
                
                <div 
                  className="border-t border-red-500/30 pt-3 mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    clarity.event('pvp_castle_attack_schedule_viewed');
                  }}
                >
                  <div className="text-center mb-2">
                    <span className="text-red-300 font-bold">⚔️ Ataques ao Castelo</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>📆 Dias de semana: 20h00 - 23h00</div>
                    <div>📆 Finais de semana: 20h00 - 23h00</div>
                  </div>
                </div>

                <div 
                  className="border-t border-red-500/30 pt-3 mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    clarity.event('pvp_clan_config_viewed');
                  }}
                >
                  <div className="text-center mb-2">
                    <span className="text-red-300 font-bold">🏰 Configurações do Clã</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>👥 Tamanho Máximo: 4 jogadores</div>
                    <div>🏰 Máximo: 2 Castelos por jogador</div>
                    <div>📏 Pisos: 50 → 550 (nível 5)</div>
                    <div>🛡️ Proteção pós-cerco: 30 min</div>
                    <div>🔄 Relocação: 3 horas</div>
                  </div>
                </div>

                <div 
                  className="border-t border-red-500/30 pt-3 mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    clarity.event('pvp_special_features_viewed');
                  }}
                >
                  <div className="text-center mb-2">
                    <span className="text-red-300 font-bold">🔥 Recursos Especiais</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>🔁 Teleporte com Itens: Ativado</div>
                    <div>🗺️ Waypoint Global: Desabilitado</div>
                    <div>🌙 Lua de Sangue: 10-18 dias (+20%)</div>
                    <div>💰 Loot Geral: 2x</div>
                    <div>💀 Contêineres: Acesso livre</div>
                    <div>⚡ Relíquias: Únicas</div>
                  </div>
                </div>

                <div 
                  className="border-t border-red-500/30 pt-3 mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    clarity.event('pvp_inactivity_system_viewed');
                  }}
                >
                  <div className="text-center mb-2">
                    <span className="text-red-300 font-bold">⏳ Sistema de Inatividade</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>⏰ Mínimo: 1 hora</div>
                    <div>📅 Máximo: 7 dias</div>
                    <div>🛡️ Segurança extra: +2 dias</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-xs text-green-400 font-bold">
                    🇧🇷 Servidor Brasileiro - Baixa Latência
                  </div>
                </div>
              </div>
            </div>

            {/* PVE Server */}
            <div 
              className="bg-black/60 backdrop-blur-sm border border-blue-500/50 rounded-xl p-8 shadow-2xl hover:border-blue-400/70 transition-all duration-300 cursor-pointer"
              onClick={() => {
                clarity.event('pve_server_info_clicked');
                clarity.set('server_type', 'pve_standard');
              }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">
                  UMBRELLIX PVE
                </h3>
                <p className="text-blue-200">
                  Cooperação e construção
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Dificuldade:</span>
                  <span className="text-blue-400 font-bold">Brutal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Max Players:</span>
                  <span className="text-blue-400 font-bold">40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Latência:</span>
                  <span className="text-green-400 font-bold">Baixa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Localização:</span>
                  <span className="text-yellow-400 font-bold">Brasil 🇧🇷</span>
                </div>
                
                <div className="border-t border-blue-500/30 pt-3 mt-4">
                  <div className="text-center mb-2">
                    <span className="text-blue-300 font-bold">🏗️ Foco em Construção</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>🏰 Castelos expandidos</div>
                    <div>🤝 Cooperação entre jogadores</div>
                    <div>🛠️ Projetos em grupo</div>
                    <div>🌟 Eventos de construção</div>
                  </div>
                </div>

                <div className="border-t border-blue-500/30 pt-3 mt-4">
                  <div className="text-center mb-2">
                    <span className="text-blue-300 font-bold">⚔️ Desafios PvE</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>👹 Bosses Brutais</div>
                    <div>🏆 Raids em grupo</div>
                    <div>💎 Loot exclusivo</div>
                    <div>🎯 Missões especiais</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-xs text-green-400 font-bold">
                    🇧🇷 Servidor Brasileiro - Baixa Latência
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-300">
            🌟 Por que escolher UMBRELLIX?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Performance Otimizada",
                description: "Servidores dedicados no Brasil para máxima performance e baixa latência"
              },
              {
                icon: "👥",
                title: "Comunidade Ativa",
                description: "Discord com mais de 1000 membros ativos, eventos regulares e suporte 24/7"
              },
              {
                icon: "🛡️",
                title: "Anti-Cheat Avançado",
                description: "Sistema robusto contra cheaters para garantir jogabilidade justa"
              },
              {
                icon: "🎮",
                title: "Mods Exclusivos",
                description: "Modificações únicas que melhoram a experiência sem quebrar o balance"
              },
              {
                icon: "📊",
                title: "Estatísticas Detalhadas",
                description: "Acompanhe seu progresso com sistema de ranking e estatísticas avançadas"
              },
              {
                icon: "🏆",
                title: "Eventos Especiais",
                description: "Torneios, eventos sazonais e recompensas exclusivas para a comunidade"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  clarity.event('feature_card_clicked');
                  clarity.set('feature_clicked', feature.title);
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-purple-400 mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/50 rounded-xl p-8 shadow-2xl">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              Junte-se à Nossa Comunidade!
            </h2>
            <p className="text-lg text-purple-200 mb-6">
              Entre no nosso Discord para ficar por dentro de todas as novidades, 
              participar de eventos e conhecer outros jogadores!
            </p>
            <a
              href="https://discord.gg/tNZDmgB6Cz"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDiscordClick}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-110 transition-all duration-300"
            >
              <span className="mr-3 text-2xl">💬</span>
              Entrar no Discord
              <span className="ml-3">🚀</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-red-500/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 UMBRELLIX - Servidor Brasileiro de V Rising. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            V Rising é uma marca registrada da Stunlock Studios.
          </p>
        </div>
      </footer>
    </div>
  );
}
