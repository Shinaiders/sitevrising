'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const MicrosoftClarity = () => {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  useEffect(() => {
    // Log para debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [CLARITY] Inicializando Microsoft Clarity...');
      if (!clarityProjectId) {
        console.warn('⚠️ [CLARITY] NEXT_PUBLIC_CLARITY_PROJECT_ID não configurado');
      } else {
        console.log(`✅ [CLARITY] Project ID configurado: ${clarityProjectId}`);
      }
    }
  }, [clarityProjectId]);

  // Não renderizar se não tiver o Project ID
  if (!clarityProjectId) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityProjectId}");
        `,
      }}
    />
  );
};

export default MicrosoftClarity; 