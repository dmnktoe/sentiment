'use client';

import { useEffect } from 'react';

export function AltchaScript() {
  useEffect(() => {
    // ALTCHA Widget Script laden
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js';
    script.type = 'module';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
