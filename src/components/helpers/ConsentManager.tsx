'use client';

import {
  ConsentBanner,
  ConsentDialog,
  ConsentManagerProvider,
  type Theme,
} from '@c15t/nextjs';
import { gtag } from '@c15t/scripts/google-tag';
import type { ComponentProps, ReactNode } from 'react';

import {
  consentBackendURL,
  consentMode,
  googleAnalyticsId,
} from '@/constant/consent';

type ConsentManagerOptions = ComponentProps<
  typeof ConsentManagerProvider
>['options'];

/**
 * Theme tokens tuned to match the SENTIMENT design system.
 *
 * We only use design tokens / slots (no global CSS overrides) so the c15t
 * components can be rendered inside a portal without inheriting any unrelated
 * styles from the parent tree. The values mirror the palette defined in
 * `tailwind.config.ts` and `globals.css`.
 */
const consentTheme = {
  colors: {
    primary: '#FF5C24',
    primaryHover: '#1F35A5',
    surface: '#ffffff',
    surfaceHover: '#f2f2f2',
    text: '#121212',
    textMuted: '#8b9094',
    border: '#121212',
  },
  dark: {
    primary: '#FF5C24',
    primaryHover: '#FF5C24',
    surface: '#121212',
    surfaceHover: '#222222',
    text: '#f5f5f5',
    textMuted: '#9ca3af',
    border: 'rgba(255,255,255,0.2)',
  },
  typography: {
    fontFamily:
      'CircularStd, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    md: '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
  },
  consentActions: {
    default: { mode: 'stroke' as const },
    accept: { variant: 'primary' as const, mode: 'filled' as const },
    customize: { variant: 'neutral' as const, mode: 'ghost' as const },
    reject: { variant: 'neutral' as const, mode: 'stroke' as const },
  },
  slots: {
    consentBannerCard:
      'rounded-2xl border border-solid border-black/10 bg-white/95 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/95',
    consentBannerHeader: 'gap-2',
    consentBannerTitle: 'font-primary tracking-tighter',
    consentBannerDescription: 'text-tertiary',
    consentBannerFooter: 'border-t border-grid px-6 py-4',
    consentDialogCard:
      'rounded-2xl border border-solid border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-950',
    consentDialogHeader: 'gap-2',
    consentDialogTag: 'shadow-none',
    consentWidgetAccordion:
      'rounded-xl border border-solid border-grid bg-white dark:bg-neutral-950',
    consentWidgetFooter: 'border-t border-grid pt-4',
    toggle: 'shadow-sm',
  },
} satisfies Theme;

/**
 * Internationalisation config; keeps copy in line with the rest of the
 * SENTIMENT site (EN default, DE available because the site is bilingual).
 */
const i18n = {
  locale: 'en',
  detectBrowserLanguage: true,
  messages: {
    en: {
      cookieBanner: {
        title: 'We value your privacy',
        description:
          'We use cookies to run essential parts of this site and — only with your permission — to measure how our research content is received. You can change your choice any time via the cookie settings in the footer or on the privacy page.',
      },
      consentManagerDialog: {
        title: 'Cookie settings',
        description:
          'Choose which types of cookies you allow. Necessary cookies are required for the site to work and are always active.',
      },
      common: {
        acceptAll: 'Accept all',
        rejectAll: 'Reject all',
        customize: 'Customize',
        save: 'Save preferences',
      },
    },
    de: {
      cookieBanner: {
        title: 'Ihre Privatsphäre ist uns wichtig',
        description:
          'Wir verwenden Cookies, um die grundlegenden Funktionen dieser Seite bereitzustellen und — nur mit Ihrer Zustimmung — um zu messen, wie unsere Forschungsinhalte genutzt werden. Sie können Ihre Auswahl jederzeit über die Cookie-Einstellungen im Footer oder auf der Datenschutz-Seite ändern.',
      },
      consentManagerDialog: {
        title: 'Cookie-Einstellungen',
        description:
          'Wählen Sie aus, welche Cookie-Arten Sie zulassen möchten. Technisch notwendige Cookies sind für den Betrieb der Website erforderlich und immer aktiv.',
      },
      common: {
        acceptAll: 'Alle akzeptieren',
        rejectAll: 'Alle ablehnen',
        customize: 'Anpassen',
        save: 'Auswahl speichern',
      },
    },
  },
};

/**
 * Shared options that are independent of the selected client mode.
 */
const sharedOptions = {
  consentCategories: ['necessary', 'measurement', 'marketing'],
  theme: consentTheme,
  colorScheme: 'system',
  scrollLock: false,
  trapFocus: true,
  legalLinks: {
    privacyPolicy: { href: '/privacy', target: '_self' },
    cookiePolicy: { href: '/cookies', target: '_self' },
    termsOfService: { href: '/legal-notice', target: '_self' },
  },
  i18n,
} as const satisfies Partial<ConsentManagerOptions>;

function buildOptions(
  scripts: ConsentManagerOptions['scripts'],
): ConsentManagerOptions {
  if (consentMode === 'hosted' || consentMode === 'c15t') {
    return {
      ...sharedOptions,
      mode: consentMode,
      backendURL: consentBackendURL,
      scripts,
    } as ConsentManagerOptions;
  }

  return {
    ...sharedOptions,
    mode: 'offline',
    scripts,
  } as ConsentManagerOptions;
}

export function ConsentManager({ children }: { children: ReactNode }) {
  // Only load the GA/gtag integration when a measurement ID is configured.
  // The integration automatically sets Google Consent Mode v2 defaults to
  // "denied" and flips the relevant signals once a user accepts measurement.
  const scripts = googleAnalyticsId
    ? [
        gtag({
          id: googleAnalyticsId,
          category: 'measurement',
        }),
      ]
    : undefined;

  return (
    <ConsentManagerProvider options={buildOptions(scripts)}>
      <ConsentBanner />
      <ConsentDialog />
      {children}
    </ConsentManagerProvider>
  );
}
