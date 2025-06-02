'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClarity } from '@/app/hooks/useClarity';

const notificationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string()
    .min(10, 'WhatsApp deve ter pelo menos 10 dígitos')
    .regex(/^[\d\s\+\-\(\)]+$/, 'WhatsApp deve conter apenas números e símbolos válidos')
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function NotificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clarity = useClarity();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema)
  });

  const onSubmit = async (data: NotificationFormData) => {
    setIsSubmitting(true);
    setError(null);

    // Registrar evento de tentativa de inscrição
    clarity.event('notification_form_submit_attempt');

    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Registrar evento de erro
        clarity.event('notification_form_submit_error');
        clarity.set('error_message', errorData.message || 'Erro desconhecido');
        
        throw new Error(errorData.message || 'Erro ao se inscrever');
      }

      // Registrar evento de sucesso
      clarity.event('notification_form_submit_success');
      clarity.set('user_subscribed', 'true');
      
      setIsSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Registrar evento quando o formulário é visualizado
  const handleFormFocus = () => {
    clarity.event('notification_form_focused');
  };

  if (isSuccess) {
    return (
      <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">
          Inscrição Realizada!
        </h3>
        <p className="text-green-200">
          Você será notificado via WhatsApp quando o servidor for lançado!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/60 backdrop-blur-sm border border-purple-500/50 rounded-xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-purple-400 mb-2">
          🔔 Receba Notificações
        </h3>
        <p className="text-purple-200">
          Seja o primeiro a saber quando o servidor for lançado!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" onFocus={handleFormFocus}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">
            Nome Completo
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            placeholder="Digite seu nome"
            className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            onFocus={() => clarity.event('notification_form_name_focused')}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-purple-300 mb-2">
            WhatsApp
          </label>
          <input
            {...register('whatsapp')}
            type="tel"
            id="whatsapp"
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            onFocus={() => clarity.event('notification_form_whatsapp_focused')}
          />
          {errors.whatsapp && (
            <p className="text-red-400 text-sm mt-1">{errors.whatsapp.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          onClick={() => clarity.event('notification_form_submit_button_clicked')}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Inscrevendo...
            </div>
          ) : (
            '📱 Quero ser Notificado!'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          🔒 Seus dados estão seguros e serão usados apenas para notificações do lançamento
        </p>
      </div>
    </div>
  );
} 