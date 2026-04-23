// Server-side only (API Routes) — never exposed to the browser
export const cmsApiUrl = process.env.CMS_API_URL;
export const cmsApiToken = process.env.CMS_API_TOKEN;
export const altchaHmacSecret = process.env.ALTCHA_HMAC_SECRET;

// Server-side only — listmonk newsletter integration
export const listmonkBaseUrl = process.env.LISTMONK_BASE_URL;
export const listmonkApiUser = process.env.LISTMONK_API_USER;
export const listmonkApiKey = process.env.LISTMONK_API_KEY;
export const listmonkListId = process.env.LISTMONK_LIST_ID;

// Public — accessible in both server and client
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const cmsPublicUrl = process.env.NEXT_PUBLIC_CMS_URL;
