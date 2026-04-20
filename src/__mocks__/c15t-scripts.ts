/**
 * Jest mock for `@c15t/scripts/*` helper packages (e.g. `google-tag`).
 *
 * Returns a plain `Script`-shaped object so that any consumer calling
 * `gtag(...)` or similar factory keeps working in the test environment.
 */
export const gtag = (options: { id: string; category: string }) => ({
  id: `gtag-${options.id}`,
  category: options.category,
  src: `https://www.googletagmanager.com/gtag/js?id=${options.id}`,
});

const scriptFactory = (name: string) => () => ({
  id: name,
  category: 'measurement',
});

export const metaPixel = scriptFactory('meta-pixel');
export const googleTagManager = scriptFactory('google-tag-manager');
export const linkedinInsights = scriptFactory('linkedin-insights');
export const microsoftUet = scriptFactory('microsoft-uet');
export const tiktokPixel = scriptFactory('tiktok-pixel');
export const xPixel = scriptFactory('x-pixel');
export const posthog = scriptFactory('posthog');
export const databuddy = scriptFactory('databuddy');
