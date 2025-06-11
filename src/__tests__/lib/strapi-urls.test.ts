import { getStrapiMedia, getStrapiURL } from '@/lib/strapi-urls';

jest.mock('@/constant/env', () => ({
  strapiApiUrl: 'https://example.com',
}));

describe('getStrapiURL', () => {
  it('should return the base URL when no path is provided', () => {
    expect(getStrapiURL()).toBe('https://example.com');
  });

  it('should append the path to the base URL', () => {
    expect(getStrapiURL('/api/posts')).toBe('https://example.com/api/posts');
    expect(getStrapiURL('api/posts')).toBe('https://example.comapi/posts');
  });
});

describe('getStrapiMedia', () => {
  it('should return an empty string if url is null', () => {
    expect(getStrapiMedia(null)).toBe('');
  });

  it('should return the url if it starts with http', () => {
    expect(getStrapiMedia('http://cdn.com/image.jpg')).toBe(
      'http://cdn.com/image.jpg',
    );
    expect(getStrapiMedia('https://cdn.com/image.jpg')).toBe(
      'https://cdn.com/image.jpg',
    );
  });

  it('should return the url if it starts with //', () => {
    expect(getStrapiMedia('//cdn.com/image.jpg')).toBe('//cdn.com/image.jpg');
  });

  it('should prepend the base URL if url is a relative path', () => {
    expect(getStrapiMedia('/uploads/image.jpg')).toBe(
      'https://example.com/uploads/image.jpg',
    );
    expect(getStrapiMedia('uploads/image.jpg')).toBe(
      'https://example.comuploads/image.jpg',
    );
  });
});
