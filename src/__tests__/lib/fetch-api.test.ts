/**
 * Tests for API fetching utility
 */
import { fetchAPI, fetchDataWithHandling } from '@/lib/fetch-api';
import { getStrapiURL } from '@/lib/strapi-urls';

// Mock dependencies
jest.mock('@/lib/strapi-urls');
const mockGetStrapiURL = getStrapiURL as jest.MockedFunction<
  typeof getStrapiURL
>;

// Mock global fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('fetchAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStrapiURL.mockImplementation(
      (path) => `http://localhost:1337${path}`,
    );
  });

  describe('Successful Requests', () => {
    it('should fetch data successfully with default options', async () => {
      const mockData = { data: [{ id: 1, title: 'Test' }] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchAPI('/articles');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:1337/api/articles',
        expect.objectContaining({
          next: { revalidate: 60 },
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      expect(result).toEqual(mockData);
    });

    it('should fetch data with query parameters', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const query = { populate: 'deep', filters: { slug: 'test' } };
      await fetchAPI('/articles', query);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('populate=deep'),
        expect.any(Object),
      );
    });

    it('should merge custom headers with defaults', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI(
        '/articles',
        {},
        { headers: { Authorization: 'Bearer token' } },
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
        }),
      );
    });

    it('should use custom revalidate time', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI('/articles', {}, { revalidate: 3600 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 3600 },
        }),
      );
    });

    it('should handle empty query object', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI('/articles', {});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:1337/api/articles',
        expect.any(Object),
      );
    });
  });

  describe('Query String Building', () => {
    it('should build query string with multiple parameters', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI('/articles', {
        page: 1,
        limit: 10,
        sort: 'createdAt:desc',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('?'),
        expect.any(Object),
      );
    });

    it('should encode query values only', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI('/articles', {
        filters: { title: 'Test & Demo' },
      });

      const call = mockFetch.mock.calls[0][0] as string;
      expect(call).toContain('filters');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle nested query objects', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI('/articles', {
        populate: {
          author: { fields: ['name', 'email'] },
        },
      });

      expect(mockFetch).toHaveBeenCalled();
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('populate');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchAPI('/articles')).rejects.toThrow(
        /Please check if your server is running/,
      );
    });

    it('should include request URL in error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchAPI('/articles')).rejects.toThrow(
        /Internal Server Error/,
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchAPI('/articles')).rejects.toThrow(
        /Please check if your server is running/,
      );
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error');

      await expect(fetchAPI('/articles')).rejects.toThrow(
        /An unknown error occurred/,
      );
    });

    it('should wrap error messages appropriately', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'));

      await expect(fetchAPI('/articles')).rejects.toThrow(/Timeout/);
    });
  });

  describe('Options Merging', () => {
    it('should not override default headers when no custom headers provided', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI('/articles', {}, {});

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    it('should preserve custom headers while keeping defaults', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await fetchAPI(
        '/articles',
        {},
        {
          headers: {
            'X-Custom-Header': 'value',
          },
        },
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value',
          },
        }),
      );
    });
  });
});

describe('fetchDataWithHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStrapiURL.mockImplementation(
      (path) => `http://localhost:1337${path}`,
    );
  });

  describe('Successful Data Extraction', () => {
    it('should extract data field from response', async () => {
      const mockData = { data: [{ id: 1, title: 'Article' }] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDataWithHandling(
        '/articles',
        {},
        'Failed to fetch articles',
      );

      expect(result).toEqual(mockData.data);
    });

    it('should pass query parameters correctly', async () => {
      const mockData = { data: { id: 1 } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const query = { filters: { slug: 'test-article' } };
      await fetchDataWithHandling('/articles', query, 'Failed');

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle empty data array', async () => {
      const mockData = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDataWithHandling('/articles', {}, 'Failed');

      expect(result).toEqual([]);
    });

    it('should handle single data object', async () => {
      const mockData = { data: { id: 1, title: 'Single Article' } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDataWithHandling('/articles/1', {}, 'Failed');

      expect(result).toEqual(mockData.data);
    });
  });

  describe('Error Handling with Custom Messages', () => {
    it('should throw error with custom message on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(
        fetchDataWithHandling('/articles', {}, 'Failed to load articles'),
      ).rejects.toThrow(/Failed to load articles/);
    });

    it('should include original error message', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection timeout'));

      await expect(
        fetchDataWithHandling('/articles', {}, 'Custom error'),
      ).rejects.toThrow(/Connection timeout/);
    });

    it('should handle unknown errors with custom message', async () => {
      mockFetch.mockRejectedValueOnce('String error');

      await expect(
        fetchDataWithHandling('/articles', {}, 'Failed to fetch'),
      ).rejects.toThrow(/Failed to fetch.*unknown error/);
    });
  });

  describe('Type Safety', () => {
    it('should return typed data', async () => {
      type Article = { id: number; title: string };
      const mockData = { data: [{ id: 1, title: 'Test' }] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDataWithHandling<Article[]>(
        '/articles',
        {},
        'Failed',
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
    });
  });
});
