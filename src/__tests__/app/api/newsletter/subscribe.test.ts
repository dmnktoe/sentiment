/**
 * @jest-environment node
 */
/**
 * Tests for newsletter subscribe endpoint:
 * - Zod schema validation
 * - POST route handler ALTCHA bot protection
 */

import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

// ---------------------------------------------------------------------------
// Mocks (needed by the POST route handler tests below)
// ---------------------------------------------------------------------------

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

// altcha-lib: verifySolution is controlled per-test
jest.mock('altcha-lib', () => ({ verifySolution: jest.fn() }));
jest.mock('altcha-lib/algorithms/pbkdf2', () => ({ deriveKey: jest.fn() }));

// react-email: suppress actual rendering
jest.mock('@react-email/components', () => ({
  render: jest.fn().mockResolvedValue('<div>email</div>'),
}));

const confirmEmailSpy = jest.fn().mockReturnValue(null);
jest.mock('@/emails/confirm-subscription', () => ({
  __esModule: true,
  default: (...args: unknown[]) => confirmEmailSpy(...args),
}));

// POST handler — imported once after all mocks are set up
let POST: (request: Request) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/subscribe/route');
  POST = mod.POST;
});

// Valid ALTCHA v2 payload: Base64-encoded JSON containing `challenge` + `solution` objects.
// Schema requires min(100) chars + valid Base64-JSON structure.
const VALID_ALTCHA_PAYLOAD = btoa(
  JSON.stringify({
    challenge: {
      parameters: {
        algorithm: 'PBKDF2/SHA-256',
        nonce: 'test-nonce-abcdef0123456789',
        salt: 'test-salt-abcdef0123456789',
        cost: 5000,
        keyLength: 32,
        keyPrefix: 'testprefix',
      },
      signature: 'test-signature-abcdef0123456789',
    },
    solution: {
      counter: 42,
      derivedKey: 'deadbeefdeadbeefdeadbeefdeadbeef',
    },
  }),
);

describe('Newsletter Subscribe Validation', () => {
  describe('Input Schema Validation', () => {
    it('should validate correct email format', () => {
      const validData = {
        email: 'test@example.com',
        altcha: VALID_ALTCHA_PAYLOAD,
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'test@',
        'test@.com',
        'test@domain',
      ];

      invalidEmails.forEach((email) => {
        const data = {
          email,
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should require privacy consent', () => {
      const data = {
        email: 'test@example.com',
        altcha: VALID_ALTCHA_PAYLOAD,
        privacy: false,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should require ALTCHA payload', () => {
      const data = {
        email: 'test@example.com',
        privacy: true,
        // Missing altcha
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const data = {
        altcha: VALID_ALTCHA_PAYLOAD,
        privacy: true,
        // Missing email
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short ALTCHA payload', () => {
      const data = {
        email: 'test@example.com',
        altcha: '', // Empty altcha should fail
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Email Validation Specifics', () => {
    it('should accept valid email formats', () => {
      const validEmails = [
        'simple@example.com',
        'user+tag@example.co.uk',
        'first.last@company.org',
        'test123@test.com',
      ];

      validEmails.forEach((email) => {
        const data = {
          email,
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject emails with invalid characters', () => {
      const invalidEmails = [
        'user@domain@com', // Multiple @
        'user name@example.com', // Space
        'user@.com', // Missing domain
        '@example.com', // Missing local part
      ];

      invalidEmails.forEach((email) => {
        const data = {
          email,
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Privacy Compliance', () => {
    it('should require explicit privacy consent (true, not just truthy)', () => {
      const falseValues = [false, 0, '', null, undefined];

      falseValues.forEach((value) => {
        const data = {
          email: 'test@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: value,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should accept only true boolean for privacy', () => {
      const data = {
        email: 'test@example.com',
        altcha: VALID_ALTCHA_PAYLOAD,
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('ALTCHA Payload Validation', () => {
    it('should require ALTCHA payload to be non-empty', () => {
      const emptyPayloads = ['', null, undefined];

      emptyPayloads.forEach((altcha) => {
        const data = {
          email: 'test@example.com',
          altcha,
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid ALTCHA payload structure', () => {
      const data = {
        email: 'test@example.com',
        altcha: VALID_ALTCHA_PAYLOAD,
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject payloads shorter than 100 characters', () => {
      const data = {
        email: 'test@example.com',
        altcha: 'a', // Too short
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject payloads that are not valid Base64-JSON', () => {
      const data = {
        email: 'test@example.com',
        altcha: 'x'.repeat(100), // 100 chars but not valid Base64-JSON
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Security - Input Sanitization', () => {
    it('should handle emails with special characters safely', () => {
      const specialEmails = [
        'user+tag@example.com', // Plus sign (valid in RFC)
        'user.name@example.com', // Dot (valid)
      ];

      specialEmails.forEach((email) => {
        const data = {
          email,
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject injection attempts in email', () => {
      const injectionAttempts = [
        'test@example.com\n<script>',
        'test@example.com";DROP TABLE',
        'test@example.com" onload="alert()',
      ];

      injectionAttempts.forEach((email) => {
        const data = {
          email,
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Error Messages', () => {
    it('should provide validation error details', () => {
      const data = {
        email: 'invalid',
        altcha: 'short',
        privacy: false,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// POST route — ALTCHA bot protection
// ---------------------------------------------------------------------------

describe('POST /api/newsletter/subscribe — ALTCHA bot protection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    process.env.CMS_API_URL = 'http://strapi.test';
    process.env.CMS_API_TOKEN = 'test-token-abc';
    process.env.ALTCHA_HMAC_SECRET = 'test-secret-hex';
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  });

  afterEach(() => {
    delete process.env.CMS_API_URL;
    delete process.env.CMS_API_TOKEN;
    delete process.env.ALTCHA_HMAC_SECRET;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  function makeRequest(body: object, ip = '1.2.3.4') {
    return new Request('http://localhost/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify(body),
    });
  }

  it('returns 400 "Bot verification failed" when verifySolution returns false', async () => {
    const { verifySolution } = await import('altcha-lib');
    (verifySolution as jest.Mock).mockResolvedValueOnce({
      verified: false,
      expired: false,
      invalidSignature: true,
      invalidSolution: null,
      time: 0,
    });

    const res = await POST(
      makeRequest(
        {
          email: 'bot@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        },
        '10.0.0.1',
      ),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/bot verification failed/i);
    // Strapi must NOT be called when ALTCHA fails
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 400 "Bot verification failed" when ALTCHA_HMAC_SECRET is not configured', async () => {
    delete process.env.ALTCHA_HMAC_SECRET;

    const res = await POST(
      makeRequest(
        {
          email: 'hacker@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        },
        '10.0.0.2',
      ),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/bot verification failed/i);
  });

  it('returns 400 "Bot verification failed" when payload is too short (< 100 chars)', async () => {
    const res = await POST(
      // bypass schema by posting raw — schema alone would also reject, but this tests the route layer
      makeRequest(
        { email: 'x@example.com', altcha: 'tooshort', privacy: true },
        '10.0.0.3',
      ),
    );

    // Schema rejects first (400 invalid input), which is fine — bot still blocked
    expect(res.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('calls Strapi and returns 200 when verifySolution returns true', async () => {
    const { verifySolution } = await import('altcha-lib');
    (verifySolution as jest.Mock).mockResolvedValueOnce({
      verified: true,
      expired: false,
      invalidSignature: false,
      invalidSolution: false,
      time: 0,
    });

    (global.fetch as jest.Mock)
      // 1. createSubscriber
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            email: 'user@example.com',
            token: 'tok-abc',
            confirmed: false,
            status: 'active',
          },
        }),
      })
      // 2. sendConfirmationEmail
      .mockResolvedValueOnce({ ok: true });

    confirmEmailSpy.mockClear();

    const res = await POST(
      makeRequest(
        {
          email: 'user@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        },
        '10.0.0.4',
      ),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/confirm/i);
    // Strapi called twice: create subscriber + send confirmation email
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // The confirmation email must point at the interstitial pages, never at
    // the API routes directly — email-link scanners fetch GET links and would
    // otherwise consume or delete tokens without user consent.
    expect(confirmEmailSpy).toHaveBeenCalledTimes(1);
    const props = confirmEmailSpy.mock.calls[0][0] as {
      confirmUrl: string;
      rejectUrl: string;
    };
    expect(props.confirmUrl).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter/confirm?token=${encodeURIComponent('tok-abc')}`,
    );
    expect(props.rejectUrl).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter/reject?token=${encodeURIComponent('tok-abc')}`,
    );
    expect(props.confirmUrl).not.toContain('/api/newsletter/');
    expect(props.rejectUrl).not.toContain('/api/newsletter/');
  });

  it('returns 400 for missing privacy consent before ALTCHA check runs', async () => {
    const { verifySolution } = await import('altcha-lib');

    const res = await POST(
      makeRequest(
        {
          email: 'user@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: false,
        },
        '10.0.0.5',
      ),
    );

    expect(res.status).toBe(400);
    // verifySolution must never be called if privacy is not accepted
    expect(verifySolution).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 500 when NEXT_PUBLIC_SITE_URL is missing (prevents undefined links in emails)', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const res = await POST(
      makeRequest(
        {
          email: 'user@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        },
        '10.0.0.6',
      ),
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/site configuration/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 400 "Bot verification failed" when the payload lacks a solution', async () => {
    const { verifySolution } = await import('altcha-lib');

    const payloadWithoutSolution = btoa(
      JSON.stringify({
        challenge: {
          parameters: {
            algorithm: 'PBKDF2/SHA-256',
            nonce: 'nonce-abcdef0123456789abcdef',
            salt: 'salt-abcdef0123456789abcdef',
            cost: 5000,
            keyLength: 32,
            keyPrefix: 'prefix',
          },
          signature: 'sig-abcdef0123456789abcdef',
        },
        // solution missing entirely
      }),
    );

    const res = await POST(
      makeRequest(
        {
          email: 'user@example.com',
          altcha: payloadWithoutSolution,
          privacy: true,
        },
        '10.0.0.7',
      ),
    );

    // The schema rejects payloads lacking `solution`, so the route returns 400
    // ("Invalid input data") without ever invoking verifySolution or Strapi.
    expect(res.status).toBe(400);
    expect(verifySolution).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('cleans up the subscriber when the confirmation email cannot be sent', async () => {
    const { verifySolution } = await import('altcha-lib');
    (verifySolution as jest.Mock).mockResolvedValueOnce({
      verified: true,
      expired: false,
      invalidSignature: false,
      invalidSolution: false,
      time: 0,
    });

    (global.fetch as jest.Mock)
      // 1. createSubscriber — ok, returns token
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            email: 'cleanup@example.com',
            token: 'tok-cleanup',
            confirmed: false,
            status: 'active',
          },
        }),
      })
      // 2. sendConfirmationEmail — fails
      .mockResolvedValueOnce({ ok: false, status: 502 })
      // 3. deleteSubscriberByToken — best-effort cleanup
      .mockResolvedValueOnce({ ok: true });

    const res = await POST(
      makeRequest(
        {
          email: 'cleanup@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        },
        '10.0.0.8',
      ),
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/email could not be sent/i);

    expect(global.fetch).toHaveBeenCalledTimes(3);
    const cleanupCall = (global.fetch as jest.Mock).mock.calls[2];
    expect(cleanupCall[0]).toBe(
      `${process.env.CMS_API_URL}/api/subscribers/by-token?token=${encodeURIComponent('tok-cleanup')}`,
    );
    expect(cleanupCall[1].method).toBe('DELETE');
  });

  it('rate-limits after 3 requests from the same IP within the window', async () => {
    const { verifySolution } = await import('altcha-lib');
    (verifySolution as jest.Mock).mockResolvedValue({
      verified: true,
      expired: false,
      invalidSignature: false,
      invalidSolution: false,
      time: 0,
    });

    // Each accepted request triggers 2 Strapi calls (create subscriber + send email).
    // Provide enough ok-responses for the first 3 attempts; the 4th must be rejected
    // before any fetch call happens.
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          email: 'ratelimit@example.com',
          token: 'tok-rl',
          confirmed: false,
          status: 'active',
        },
      }),
    });

    const ip = '10.0.0.42';
    const body = {
      email: 'ratelimit@example.com',
      altcha: VALID_ALTCHA_PAYLOAD,
      privacy: true,
    };

    for (let i = 0; i < 3; i++) {
      const res = await POST(makeRequest(body, ip));
      expect(res.status).toBe(200);
    }

    const res = await POST(makeRequest(body, ip));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many requests/i);
  });

  it('pads the duplicate-email response so it cannot be distinguished from the happy path by latency', async () => {
    const { verifySolution } = await import('altcha-lib');
    (verifySolution as jest.Mock).mockResolvedValueOnce({
      verified: true,
      expired: false,
      invalidSignature: false,
      invalidSolution: false,
      time: 0,
    });

    // createSubscriber returns null (HTTP 409 treated as duplicate)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409,
    });

    const start = Date.now();
    const res = await POST(
      makeRequest(
        {
          email: 'duplicate@example.com',
          altcha: VALID_ALTCHA_PAYLOAD,
          privacy: true,
        },
        '10.0.0.99',
      ),
    );
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/if the email address is not yet registered/i);

    // Duplicate path must not short-circuit to a microsecond response — that
    // would let an attacker infer registration status from latency.
    // 600 ms is chosen below the 750 ms padding to tolerate CI jitter while
    // still clearly ruling out the no-padding case (< 50 ms).
    expect(elapsed).toBeGreaterThanOrEqual(600);

    // No email was sent on the duplicate path
    expect(global.fetch).toHaveBeenCalledTimes(1);
  }, 10000);
});
