/**
 * @jest-environment node
 */

// Mock render used by sendGoodbyeEmail so tests don't depend on react-email rendering
jest.mock('@react-email/components', () => ({
  render: jest.fn().mockResolvedValue('<div>email</div>'),
}));

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

let GET: (request: Request) => Promise<Response>;
let POST: (request: Request) => Promise<Response>;
let unsubscribeUser: (
  token: string,
) => Promise<{ success: boolean; email?: string }>;
let sendGoodbyeEmail: (email: string) => Promise<void>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/unsubscribe/route');
  GET = mod.GET;
  POST = mod.POST;
  unsubscribeUser = mod.unsubscribeUser;
  sendGoodbyeEmail = mod.sendGoodbyeEmail;
});

describe('Newsletter unsubscribe (unit)', () => {
  beforeEach(() => {
    // clearAllMocks preserves mock implementations (e.g. render's mockResolvedValue)
    jest.clearAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    process.env.CMS_API_URL = 'http://strapi.test';
    process.env.CMS_API_TOKEN = 'test-token-abc';
  });

  afterEach(() => {
    delete process.env.CMS_API_URL;
    delete process.env.CMS_API_TOKEN;
  });

  describe('unsubscribeUser', () => {
    it('returns success + email when Strapi responds ok with email', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ email: 'user@example.com' }),
      });

      const token = 't/oken+value';
      const result = await unsubscribeUser(token);

      expect(result).toEqual({ success: true, email: 'user@example.com' });
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.CMS_API_URL}/api/subscribers/unsubscribe?token=${encodeURIComponent(
          token,
        )}`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
          }),
        }),
      );
    });

    it('returns success true with undefined email when response has no email', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const res = await unsubscribeUser('token');
      expect(res).toEqual({ success: true, email: undefined });
    });

    it('returns success:false when Strapi responds non-ok', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const res = await unsubscribeUser('bad');
      expect(res).toEqual({ success: false });
    });

    it('returns success:false on network error', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('network'));

      const res = await unsubscribeUser('any');
      expect(res).toEqual({ success: false });
    });
  });

  describe('sendGoodbyeEmail', () => {
    it('posts email to Strapi /api/email with correct body and headers', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true });

      await sendGoodbyeEmail('bye@example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.CMS_API_URL}/api/email`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
          }),
          body: expect.any(String),
        }),
      );

      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body,
      );
      expect(body.to).toBe('bye@example.com');
      expect(body.subject).toMatch(/unsubscription confirmed/i);
      expect(body.html === undefined || typeof body.html === 'string').toBe(
        true,
      );
    });

    it('does not throw when email send fails', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'));
      await expect(sendGoodbyeEmail('a@b.c')).resolves.toBeUndefined();
    });
  });

  describe('GET handler (prefetcher protection)', () => {
    it('redirects to the interstitial page and preserves the token', async () => {
      const req = new Request(
        'http://localhost/api/newsletter/unsubscribe?token=some-token',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      const location = res.headers.get('location')!;
      expect(location).toContain('/newsletter/unsubscribe');
      expect(location).toContain('token=some-token');
      // GET must never call Strapi — only the user-initiated POST can unsubscribe.
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('redirects without a token when one is absent', async () => {
      const req = new Request('http://localhost/api/newsletter/unsubscribe');
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/newsletter/unsubscribe');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('POST handler', () => {
    function jsonRequest(body: unknown) {
      return new Request('http://localhost/api/newsletter/unsubscribe', {
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

    it('returns 200 ok and sends goodbye email when Strapi returns an email', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ email: 'x@y.z' }),
        })
        .mockResolvedValueOnce({ ok: true });

      const res = await POST(jsonRequest({ token: 'ok' }));

      // The goodbye email is fire-and-forget — flush microtasks before asserting.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ok: true });
      expect(global.fetch).toHaveBeenCalledTimes(2);

      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
        '/api/subscribers/unsubscribe',
      );

      const emailCall = (global.fetch as jest.Mock).mock.calls[1];
      expect(emailCall[0]).toBe(`${process.env.CMS_API_URL}/api/email`);
      const body = JSON.parse(emailCall[1].body);
      expect(body.to).toBe('x@y.z');
    });

    it('returns 200 ok without sending a goodbye email when Strapi returns no email', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      const res = await POST(jsonRequest({ token: 'no-email' }));

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ok: true });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('returns 400 invalid-token when Strapi rejects the unsubscribe', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const res = await POST(jsonRequest({ token: 'bad' }));

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ ok: false, reason: 'invalid-token' });
    });

    it('accepts a token submitted as form data', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      const form = new FormData();
      form.set('token', 'form-token');

      const req = new Request('http://localhost/api/newsletter/unsubscribe', {
        method: 'POST',
        body: form,
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });
});
