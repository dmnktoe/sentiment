'use client';

import type {} from 'altcha/types/react';
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

    import('altcha').catch(() => {});
  }, []);

  return null;
}
