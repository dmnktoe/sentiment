// jest-environment-jsdom can't resolve next/cache which c15t/next pulls in
import type { ReactNode } from 'react';

const Passthrough = ({ children }: { children: ReactNode }) => <>{children}</>;

export const ConsentProvider = Passthrough;
export const ConsentDraftProvider = Passthrough;

export const local = (options?: Record<string, unknown>) => ({
  kind: 'local',
  ...options,
});

const surface = { isVisible: false };

export const useHeadlessConsentUI = () => ({
  activeUI: 'none' as const,
  banner: surface,
  dialog: surface,
  closeUI: () => undefined,
  openBanner: () => undefined,
  openDialog: () => undefined,
  performAction: () => undefined,
  saveCustomPreferences: () => Promise.resolve({ ok: true }),
});

export const useConsentDraft = () => ({
  values: {
    necessary: true,
    measurement: false,
    functionality: false,
    experience: false,
    marketing: false,
  },
  set: () => undefined,
  save: () => Promise.resolve({ ok: true }),
});
