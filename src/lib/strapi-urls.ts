import { strapiApiUrl } from '@/constant/env';

export function getStrapiURL(path = '') {
  return `${strapiApiUrl}${path}`;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return '';
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${getStrapiURL()}${url}`;
}
