/**
 * @jest-environment node
 */

// Mock @/constant/env with getters so values are read at call time (after beforeEach sets process.env)
jest.mock('@/constant/env', () => ({
  get cmsApiUrl() {
    return process.env.CMS_API_URL;
  },
  get cmsApiToken() {
    return process.env.CMS_API_TOKEN;
  },
  get altchaHmacSecret() {
    return process.env.ALTCHA_HMAC_SECRET;
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL;
  },
  get cmsPublicUrl() {
    return process.env.NEXT_PUBLIC_CMS_URL;
  },
}));

// Import route module dynamically after polyfills (avoid hoisted import timing issues)
let GET: (request: Request) => Promise<Response>;
let confirmSubscription: (token: string) => Promise<boolean>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/confirm/route');
  GET = mod.GET;
  confirmSubscription = mod.confirmSubscription;
});

describe('Newsletter confirm route (unit)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    process.env.CMS_API_URL = 'http://strapi.test';
    process.env.CMS_API_TOKEN = 'test-token-abc';
  });

  afterEach(() => {
    delete process.env.CMS_API_URL;
    delete process.env.CMS_API_TOKEN;
  });

  describe('confirmSubscription helper', () => {
    it('returns true when Strapi responds ok and calls fetch with correct headers', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      const token = 'valid-token-123';
      const res = await confirmSubscription(token);

      expect(res).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
        `${process.env.CMS_API_URL}/api/subscribers/confirm?token=${encodeURIComponent(
          token,
        )}`,
      );

      const opts = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(opts.method).toBe('PUT');
      expect(opts.headers.Authorization).toBe(
        `Bearer ${process.env.CMS_API_TOKEN}`,
      );
    });

    it('returns false when Strapi responds with non-ok', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const result = await confirmSubscription('bad-token');
      expect(result).toBe(false);
    });

    it('propagates network errors (rejects) so caller can handle server-error', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('network'));

      await expect(confirmSubscription('any')).rejects.toThrow('network');
    });
  });

  describe('GET handler', () => {
    it('redirects to missing-token when token param is absent', async () => {
      const req = new Request('http://localhost/api/newsletter/confirm');
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain(
        '/newsletter/error?reason=missing-token',
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('redirects to invalid-token when token param is empty', async () => {
      const req = new Request('http://localhost/api/newsletter/confirm?token=');
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain(
        '/newsletter/error?reason=invalid-token',
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('redirects to success when confirmation succeeds', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      const req = new Request(
        'http://localhost/api/newsletter/confirm?token=ok-token',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain('/newsletter/success');

      // confirmSubscription should have called Strapi with token encoded
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.CMS_API_URL}/api/subscribers/confirm?token=${encodeURIComponent('ok-token')}`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
          }),
        }),
      );
    });

    it('redirects to invalid-token when Strapi responds non-ok', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const req = new Request(
        'http://localhost/api/newsletter/confirm?token=invalid-token',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain(
        '/newsletter/error?reason=invalid-token',
      );
    });

    it('redirects to server-error when Strapi network error occurs', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('network'));

      const req = new Request(
        'http://localhost/api/newsletter/confirm?token=network-error',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain(
        '/newsletter/error?reason=server-error',
      );
    });
  });
});
