'use client';

import AdminPanel from '../components/AdminPanel';
import { useClarity } from '../hooks/useClarity';
import { useEffect } from 'react';

export default function AdminPage() {
  const clarity = useClarity();

  useEffect(() => {
    // Registrar que alguém acessou a página admin
    clarity.event('admin_page_accessed');
  }, [clarity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
            🦇 UMBRELLIX - ADMIN 🏰
          </h1>
          <p className="text-lg md:text-xl text-red-200 font-semibold">
            Painel Administrativo do Servidor V Rising
          </p>
        </div>
      </header>

      {/* Admin Panel */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <AdminPanel />
        </div>
      </section>

      {/* Navigation */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            onClick={() => clarity.event('admin_back_to_home_clicked')}
          >
            <span className="mr-2">🏠</span>
            Voltar para o Site Principal
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-red-500/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            🔒 Área Administrativa - Acesso Restrito
          </p>
          <p className="text-sm text-gray-500 mt-2">
            UMBRELLIX V Rising Server Management
          </p>
        </div>
      </footer>
    </div>
  );
} 