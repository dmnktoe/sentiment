export const umamiAnalytics = (options: { websiteId: string }) => ({
  id: 'umami-analytics',
  src: 'https://cloud.umami.is/script.js',
  category: 'measurement' as const,
  defer: true,
  attributes: { 'data-website-id': options.websiteId },
});
