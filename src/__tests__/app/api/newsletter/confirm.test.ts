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

// Import route module dynamically after mocks (avoid hoisted import timing issues)
let GET: (request: Request) => Promise<Response>;
let POST: (request: Request) => Promise<Response>;
let confirmSubscription: (token: string) => Promise<boolean>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/confirm/route');
  GET = mod.GET;
  POST = mod.POST;
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

    it('propagates network errors so the POST handler returns server-error', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('network'));

      await expect(confirmSubscription('any')).rejects.toThrow('network');
    });
  });

  describe('GET handler (prefetcher protection)', () => {
    it('redirects to the interstitial page and preserves the token', async () => {
      const req = new Request(
        'http://localhost/api/newsletter/confirm?token=abc%20123',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      const location = res.headers.get('location')!;
      expect(location).toContain('/newsletter/confirm');
      expect(location).toContain('token=abc+123');
      // GET must never call Strapi — it exists only to bounce the user into
      // the interstitial where an explicit POST is required.
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('redirects to the interstitial without a token when token is absent', async () => {
      const req = new Request('http://localhost/api/newsletter/confirm');
      const res = await GET(req);

      expect(res.status).toBe(307);
      const location = res.headers.get('location')!;
      expect(location).toContain('/newsletter/confirm');
      expect(location).not.toContain('token=');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('POST handler', () => {
    function jsonRequest(body: unknown) {
      return new Request('http://localhost/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    it('returns 400 missing-token when no token is provided', async () => {
      const res = await POST(jsonRequest({}));

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ ok: false, reason: 'missing-token' });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 400 invalid-token when Strapi rejects the token', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const res = await POST(jsonRequest({ token: 'bad' }));

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ ok: false, reason: 'invalid-token' });
    });

    it('returns 200 ok when Strapi confirms the token', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      const res = await POST(jsonRequest({ token: 'good' }));

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ok: true });

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.CMS_API_URL}/api/subscribers/confirm?token=${encodeURIComponent('good')}`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
          }),
        }),
      );
    });

    it('returns 500 server-error when Strapi network fails', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('network'));

      const res = await POST(jsonRequest({ token: 'ok' }));

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json).toEqual({ ok: false, reason: 'server-error' });
    });

    it('accepts a token submitted as form data', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      const form = new FormData();
      form.set('token', 'form-token');

      const req = new Request('http://localhost/api/newsletter/confirm', {
        method: 'POST',
        body: form,
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it('ignores malformed JSON bodies and returns missing-token', async () => {
      const req = new Request('http://localhost/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ not valid',
      });

      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ ok: false, reason: 'missing-token' });
    });
  });
});
