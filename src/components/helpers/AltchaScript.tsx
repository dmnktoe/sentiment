'use client';

import { useEffect } from 'react';

export function AltchaScript() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.customElements === 'undefined') {
      return;
    }

    if (window.customElements.get('altcha-widget')) {
      return;
    }

    import('altcha').catch(() => {
      // Intentionally ignore load errors; form can still be submitted.
    });
  }, []);

  return null;
}
