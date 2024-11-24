import qs from 'qs';

import { getStrapiURL } from '@/lib/strapi-urls';

type FetchOptions = {
  revalidate?: number;
  headers?: Record<string, string>;
};

interface QueryParams {
  [key: string]: string | number | boolean | object;
}

export async function fetchAPI(
  path: string,
  query: QueryParams = {},
  options: FetchOptions = {}
) {
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

function handleFetchError(error: unknown, defaultMessage: string): never {
  if (error instanceof Error) {
    throw new Error(`${defaultMessage}: ${error.message}`);
  } else {
    throw new Error(`${defaultMessage} due to an unknown error.`);
  }
}

export async function fetchDataWithHandling<T>(
  path: string,
  query: QueryParams,
  errorMessage: string
): Promise<T> {
  try {
    const data = await fetchAPI(path, query);
    return data.data;
  } catch (error) {
    handleFetchError(error, errorMessage);
  }
}
