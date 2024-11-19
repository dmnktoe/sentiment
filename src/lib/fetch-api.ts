import qs from 'qs';

import { getStrapiURL } from '@/lib/strapi-urls';

type FetchOptions = {
  revalidate?: number;
  headers?: Record<string, string>;
};

interface QueryParams {
  [key: string]: any;
}

export async function fetchAPI(path: string, query: QueryParams = {}, options: FetchOptions = {}) {
  try {
    const defaultOptions = {
      revalidate: 60,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions: FetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    const queryString = qs.stringify(query, { encodeValuesOnly: true });
    const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ''}`)}`;

    const response = await fetch(requestUrl, {
      next: { revalidate: mergedOptions.revalidate },
      headers: mergedOptions.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${requestUrl}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Please check if your server is running and you set all the required tokens. Error: ${error.message}`
      );
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
}
