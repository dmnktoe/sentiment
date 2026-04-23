/**
 * @jest-environment node
 */

// Mock @/constant/env with getters so values are read at call time (after beforeEach sets process.env)
jest.mock('@/constant/env', () => ({
  get altchaHmacSecret() {
    return process.env.ALTCHA_HMAC_SECRET;
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL;
  },
  get cmsPublicUrl() {
    return process.env.NEXT_PUBLIC_CMS_URL;
  },
  get listmonkBaseUrl() {
    return process.env.LISTMONK_BASE_URL;
  },
  get listmonkApiUser() {
    return process.env.LISTMONK_API_USER;
  },
  get listmonkApiKey() {
    return process.env.LISTMONK_API_KEY;
  },
  get listmonkListId() {
    return process.env.LISTMONK_LIST_ID;
  },
}));

// Import route module dynamically after polyfills to avoid hoisting issues
let GET: (request: Request) => Promise<Response>;
let unsubscribeUser: (
  token: string,
) => Promise<{ success: boolean; email?: string }>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/unsubscribe/route');
  GET = mod.GET;
  unsubscribeUser = mod.unsubscribeUser;
});

describe('Newsletter unsubscribe (unit)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    process.env.LISTMONK_BASE_URL = 'http://listmonk.test';
    process.env.LISTMONK_API_USER = 'api_username';
    process.env.LISTMONK_API_KEY = 'api_key';
    process.env.LISTMONK_LIST_ID = '1';
  });

  afterEach(() => {
    delete process.env.LISTMONK_BASE_URL;
    delete process.env.LISTMONK_API_USER;
    delete process.env.LISTMONK_API_KEY;
    delete process.env.LISTMONK_LIST_ID;
  });

  describe('unsubscribeUser', () => {
    it('returns success + email when subscriber found and list update succeeds', async () => {
      (global.fetch as jest.Mock)
        // findSubscriberByUuid
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            data: {
              results: [
                {
                  id: 99,
                  uuid: 'uuid',
                  email: 'user@example.com',
                  name: 'n',
                  status: 'enabled',
                },
              ],
              total: 1,
            },
          }),
        })
        // unsubscribeSubscriberFromLists
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ data: true }),
        });

      const token = 't/oken+value';
      const result = await unsubscribeUser(token);

      expect(result).toEqual({ success: true, email: 'user@example.com' });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('returns success:false when subscriber lookup fails', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: { results: [], total: 0 } }),
      });

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

    it('redirects to unsubscribed when unsubscribe succeeds', async () => {
      (global.fetch as jest.Mock)
        // findSubscriberByUuid
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            data: {
              results: [
                {
                  id: 99,
                  uuid: 'uuid',
                  email: 'x@y.z',
                  name: 'n',
                  status: 'enabled',
                },
              ],
              total: 1,
            },
          }),
        })
        // unsubscribeSubscriberFromLists
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ data: true }),
        });

      const req = new Request(
        'http://localhost/api/newsletter/unsubscribe?token=ok',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/newsletter/unsubscribed');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('redirects to invalid-token when unsubscribe fails', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: { results: [], total: 0 } }),
      });

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
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({
              data: {
                results: [
                  {
                    id: 99,
                    uuid: 'uuid',
                    email: 'x@y.z',
                    name: 'n',
                    status: 'enabled',
                  },
                ],
                total: 1,
              },
            }),
          })
          .mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ data: true }),
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
