/**
 * Configuration for the c15t consent manager.
 *
 * Values are read from `NEXT_PUBLIC_*` environment variables so that they are
 * available both during server rendering and on the client.
 *
 * Fill these in via `.env.local` (see `.env.example`).
 */

export const consentMode = (process.env.NEXT_PUBLIC_C15T_MODE ?? 'offline') as
  | 'offline'
  | 'hosted'
  | 'c15t'
  | 'custom';

export const consentBackendURL =
  process.env.NEXT_PUBLIC_C15T_BACKEND_URL ?? '/api/c15t';

export const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID ?? '';
