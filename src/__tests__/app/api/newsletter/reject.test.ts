/**
 * @jest-environment node
 */

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

let GET: (request: Request) => Promise<Response>;
let POST: (request: Request) => Promise<Response>;
let rejectSubscription: (token: string) => Promise<boolean>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/reject/route');
  GET = mod.GET;
  POST = mod.POST;
  rejectSubscription = mod.rejectSubscription;
});

describe('Newsletter reject route ("that wasn\'t me")', () => {
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

  describe('rejectSubscription helper', () => {
    it('calls Strapi DELETE /api/subscribers/by-token and returns true on success', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      const token = 'tok 123';
      const result = await rejectSubscription(token);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.CMS_API_URL}/api/subscribers/by-token?token=${encodeURIComponent(token)}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
          }),
        }),
      );
    });

    it('returns false when Strapi responds non-ok (token unknown or already confirmed)', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 });

      const result = await rejectSubscription('whatever');
      expect(result).toBe(false);
    });

    it('returns false on network failure instead of propagating', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('network'));

      const result = await rejectSubscription('any');
      expect(result).toBe(false);
    });
  });

  describe('GET handler (prefetcher protection)', () => {
    it('redirects to the interstitial page with the token preserved', async () => {
      const req = new Request(
        'http://localhost/api/newsletter/reject?token=tok-xyz',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      const location = res.headers.get('location')!;
      expect(location).toContain('/newsletter/reject');
      expect(location).toContain('token=tok-xyz');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('POST handler', () => {
    function jsonRequest(body: unknown) {
      return new Request('http://localhost/api/newsletter/reject', {
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

    it('returns 200 ok when Strapi deletes the unconfirmed subscriber', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      const res = await POST(jsonRequest({ token: 'unconfirmed-tok' }));

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ok: true });

      const call = (global.fetch as jest.Mock).mock.calls[0];
      expect(call[0]).toBe(
        `${process.env.CMS_API_URL}/api/subscribers/by-token?token=${encodeURIComponent('unconfirmed-tok')}`,
      );
      expect(call[1].method).toBe('DELETE');
    });

    it('returns 400 invalid-token when Strapi rejects (already confirmed or unknown)', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 });

      const res = await POST(jsonRequest({ token: 'confirmed-tok' }));

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ ok: false, reason: 'invalid-token' });
    });
  });
});
