'use client';

import { useConsentManager } from '@c15t/nextjs';
import type { ReactNode } from 'react';

import clsxm from '@/lib/clsxm';

/**
 * Small pill-style button that opens the c15t consent dialog.
 *
 * Used for the "manage cookies" affordance in the footer and anywhere else
 * where a user should be able to re-open their consent preferences without
 * navigating to the dedicated cookies page.
 */
export function CookieSettingsButton({
  children = 'Cookie settings',
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { setActiveUI } = useConsentManager();

  return (
    <button
      type='button'
      onClick={() => setActiveUI('dialog')}
      className={clsxm(
        'inline-flex items-center justify-center rounded-full border border-solid border-text/30 px-4 py-1 text-sm text-text transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg',
        'dark:border-white/30 dark:text-text dark:hover:border-primary',
        className,
      )}
    >
      {children}
    </button>
  );
}
