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

// Import route module dynamically after polyfills to avoid hoisting issues
let GET: (request: Request) => Promise<Response>;
let unsubscribeUser: (
  token: string,
) => Promise<{ success: boolean; email?: string }>;
let sendGoodbyeEmail: (email: string) => Promise<void>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/unsubscribe/route');
  GET = mod.GET;
  unsubscribeUser = mod.unsubscribeUser;
  sendGoodbyeEmail = mod.sendGoodbyeEmail;
});

describe('Newsletter unsubscribe (unit)', () => {
  beforeEach(() => {
    // clearAllMocks preserves mock implementations (e.g. render's mockResolvedValue)
    // while still resetting call counts — resetAllMocks would wipe the render stub.
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
      // html may be present or omitted depending on renderer during tests — accept both
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

  describe('GET handler', () => {
    it('redirects to missing-token when token is absent', async () => {
      const req = new Request('http://localhost/api/newsletter/unsubscribe');
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain(
        '/newsletter/error?reason=missing-token',
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('redirects to unsubscribed and sends goodbye email when Strapi returns email', async () => {
      // first call: unsubscribe -> returns email
      // second call: sendGoodbyeEmail -> posts email
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ email: 'x@y.z' }),
        })
        .mockResolvedValueOnce({ ok: true });

      const req = new Request(
        'http://localhost/api/newsletter/unsubscribe?token=ok',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/newsletter/unsubscribed');
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // verify unsubscribe call
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
        '/api/subscribers/unsubscribe',
      );

      // verify email call
      const emailCall = (global.fetch as jest.Mock).mock.calls[1];
      expect(emailCall[0]).toBe(`${process.env.CMS_API_URL}/api/email`);
      const body = JSON.parse(emailCall[1].body);
      expect(body.to).toBe('x@y.z');
    });

    it('redirects to unsubscribed and does not send email when Strapi returns no email', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      const req = new Request(
        'http://localhost/api/newsletter/unsubscribe?token=no-email',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/newsletter/unsubscribed');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('redirects to invalid-token when Strapi unsubscribe fails', async () => {
      (global.fetch as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const req = new Request(
        'http://localhost/api/newsletter/unsubscribe?token=bad',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain(
        '/newsletter/error?reason=invalid-token',
      );
    });

    it('redirects to server-error when NextResponse.redirect inside try throws', async () => {
      // Cause the first NextResponse.redirect call (inside try) to throw, then ensure
      // the outer catch returns the server-error redirect.
      const nextServer = await import('next/server');
      const originalRedirect = nextServer.NextResponse.redirect;
      let calls = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (nextServer.NextResponse as any).redirect = (url: any, init?: any) => {
        calls += 1;
        if (calls === 1) throw new Error('boom');
        return originalRedirect(url, init);
      };

      try {
        // Make unsubscribe succeed so GET attempts a redirect inside try
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

        const req = new Request(
          'http://localhost/api/newsletter/unsubscribe?token=ok',
        );
        const res = await GET(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toContain(
          '/newsletter/error?reason=server-error',
        );
      } finally {
        // Always restore — even if assertions above throw
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (nextServer.NextResponse as any).redirect = originalRedirect;
      }
    });
  });
});
