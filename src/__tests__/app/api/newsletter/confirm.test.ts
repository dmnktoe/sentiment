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

// Import route module dynamically after polyfills (avoid hoisted import timing issues)
let GET: (request: Request) => Promise<Response>;
let getListmonkOptInUrl: (token: string) => string | null;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/confirm/route');
  GET = mod.GET;
  getListmonkOptInUrl = mod.getListmonkOptInUrl;
});

describe('Newsletter confirm route (unit)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.LISTMONK_BASE_URL = 'https://newsletter.project-sentiment.org';
  });

  afterEach(() => {
    delete process.env.LISTMONK_BASE_URL;
  });

  describe('getListmonkOptInUrl helper', () => {
    it('returns null when LISTMONK_BASE_URL is missing', () => {
      delete process.env.LISTMONK_BASE_URL;
      expect(getListmonkOptInUrl('uuid')).toBeNull();
    });

    it('builds opt-in URL with encoded token', () => {
      expect(getListmonkOptInUrl('a/b+c')).toBe(
        'https://newsletter.project-sentiment.org/subscription/optin/a%2Fb%2Bc',
      );
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
    });

    it('redirects to invalid-token when token param is empty', async () => {
      const req = new Request('http://localhost/api/newsletter/confirm?token=');
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain(
        '/newsletter/error?reason=invalid-token',
      );
    });

    it('redirects to listmonk opt-in page when token is present', async () => {
      const req = new Request(
        'http://localhost/api/newsletter/confirm?token=ok-token',
      );
      const res = await GET(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toBe(
        'https://newsletter.project-sentiment.org/subscription/optin/ok-token',
      );
    });

    it('redirects to server-error when LISTMONK_BASE_URL is missing', async () => {
      delete process.env.LISTMONK_BASE_URL;
      const req = new Request(
        'http://localhost/api/newsletter/confirm?token=ok-token',
      );
      const res = await GET(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')!).toContain(
        '/newsletter/error?reason=server-error',
      );
    });
  });
});
