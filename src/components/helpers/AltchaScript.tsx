'use client';

import { useEffect } from 'react';

export function AltchaScript() {
  useEffect(() => {
    if (document.querySelector('script[src*="altcha"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js';
    script.type = 'module';
    script.async = true;

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="altcha"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}
