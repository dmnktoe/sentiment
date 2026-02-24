// Server-side only (API Routes) — never exposed to the browser
export const cmsApiUrl = process.env.CMS_API_URL;
export const cmsApiToken = process.env.CMS_API_TOKEN;
export const altchaHmacSecret = process.env.ALTCHA_HMAC_SECRET;

// Public — accessible in both server and client
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const cmsPublicUrl = process.env.NEXT_PUBLIC_CMS_URL;
