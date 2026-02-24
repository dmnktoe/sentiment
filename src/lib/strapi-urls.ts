import { cmsApiUrl, cmsPublicUrl } from '@/constant/env';

export function getStrapiURL(path = '') {
  return `${cmsApiUrl}${path}`;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return '';
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Use the public CMS URL (NEXT_PUBLIC_CMS_URL) so this works on both
  // server and client — cmsApiUrl is server-only and undefined in the browser.
  return `${cmsPublicUrl}${url}`;
}
