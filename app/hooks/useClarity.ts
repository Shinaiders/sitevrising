'use client';

import { useEffect, useState } from 'react';

// Declaração de tipos para o Microsoft Clarity
declare global {
  interface Window {
    clarity?: {
      (action: 'start', config: { projectId: string }): void;
      (action: 'identify', userId: string, sessionId?: string, pageId?: string, userHint?: string): void;
      (action: 'consent'): void;
      (action: 'event', eventName: string): void;
      (action: 'set', key: string, value: string): void;
      (action: 'upgrade', upgradeReason: string): void;
    };
  }
}

interface ClarityHook {
  isLoaded: boolean;
  identify: (userId: string, sessionId?: string, pageId?: string, userHint?: string) => void;
  event: (eventName: string) => void;
  set: (key: string, value: string) => void;
  consent: () => void;
  upgrade: (upgradeReason: string) => void;
}

export const useClarity = (): ClarityHook => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Verificar se o Clarity está carregado
    const checkClarity = () => {
      if (typeof window !== 'undefined' && window.clarity) {
        setIsLoaded(true);
        console.log('✅ [CLARITY HOOK] Microsoft Clarity carregado e pronto');
      } else {
        // Tentar novamente em 100ms
        setTimeout(checkClarity, 100);
      }
    };

    checkClarity();
  }, []);

  const identify = (userId: string, sessionId?: string, pageId?: string, userHint?: string) => {
    if (isLoaded && window.clarity) {
      window.clarity('identify', userId, sessionId, pageId, userHint);
      console.log(`🔍 [CLARITY] Usuário identificado: ${userId}`);
    } else {
      console.warn('⚠️ [CLARITY] Clarity não está carregado ainda');
    }
  };

  const event = (eventName: string) => {
    if (isLoaded && window.clarity) {
      window.clarity('event', eventName);
      console.log(`📊 [CLARITY] Evento registrado: ${eventName}`);
    } else {
      console.warn('⚠️ [CLARITY] Clarity não está carregado ainda');
    }
  };

  const set = (key: string, value: string) => {
    if (isLoaded && window.clarity) {
      window.clarity('set', key, value);
      console.log(`🏷️ [CLARITY] Tag definida: ${key} = ${value}`);
    } else {
      console.warn('⚠️ [CLARITY] Clarity não está carregado ainda');
    }
  };

  const consent = () => {
    if (isLoaded && window.clarity) {
      window.clarity('consent');
      console.log('✅ [CLARITY] Consentimento registrado');
    } else {
      console.warn('⚠️ [CLARITY] Clarity não está carregado ainda');
    }
  };

  const upgrade = (upgradeReason: string) => {
    if (isLoaded && window.clarity) {
      window.clarity('upgrade', upgradeReason);
      console.log(`⬆️ [CLARITY] Upgrade registrado: ${upgradeReason}`);
    } else {
      console.warn('⚠️ [CLARITY] Clarity não está carregado ainda');
    }
  };

  return {
    isLoaded,
    identify,
    event,
    set,
    consent,
    upgrade,
  };
}; 