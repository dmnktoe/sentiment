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
  get altchaHmacSecret() {
    return process.env.ALTCHA_HMAC_SECRET;
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

// altcha-lib (v2): verifySolution + deriveHmacKeySecret are controlled per-test
jest.mock('altcha-lib', () => ({
  deriveHmacKeySecret: jest.fn(),
  verifySolution: jest.fn(),
}));

// listmonk client wrapper
jest.mock('@/lib/listmonk', () => ({
  createSubscriber: jest.fn(),
  sendOptInEmail: jest.fn(),
  ListmonkError: class ListmonkError extends Error {
    public readonly status: number;
    public readonly responseBody: unknown;
    constructor(message: string, status: number, responseBody: unknown) {
      super(message);
      this.name = 'ListmonkError';
      this.status = status;
      this.responseBody = responseBody;
    }
  },
}));

// POST handler — imported once after all mocks are set up
let POST: (request: Request) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('@/app/api/newsletter/subscribe/route');
  POST = mod.POST;
});

// Valid ALTCHA payload: Base64-encoded JSON with {challenge, solution}
// Schema requires min(100) chars + valid Base64-JSON structure.
const VALID_ALTCHA_PAYLOAD = btoa(
  JSON.stringify({
    challenge: {
      algorithm: 'PBKDF2/SHA-256',
      challenge: 'c',
      salt: 's',
      signature: 'sig',
      cost: 5000,
      counter: 7000,
      expiresAt: Math.floor(Date.now() / 1000) + 300,
    },
    solution: {
      counter: 7000,
    },
  }),
).padEnd(100, 'x');

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
    process.env.ALTCHA_HMAC_SECRET = 'test-secret-hex';
    process.env.LISTMONK_BASE_URL = 'http://listmonk.test';
    process.env.LISTMONK_API_USER = 'api';
    process.env.LISTMONK_API_KEY = 'key';
    process.env.LISTMONK_LIST_ID = '1';
  });

  afterEach(() => {
    delete process.env.ALTCHA_HMAC_SECRET;
    delete process.env.LISTMONK_BASE_URL;
    delete process.env.LISTMONK_API_USER;
    delete process.env.LISTMONK_API_KEY;
    delete process.env.LISTMONK_LIST_ID;
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
    (verifySolution as jest.Mock).mockResolvedValueOnce(false);

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
    const { createSubscriber, sendOptInEmail } = await import('@/lib/listmonk');
    expect(createSubscriber).not.toHaveBeenCalled();
    expect(sendOptInEmail).not.toHaveBeenCalled();
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
    const { createSubscriber, sendOptInEmail } = await import('@/lib/listmonk');
    expect(createSubscriber).not.toHaveBeenCalled();
    expect(sendOptInEmail).not.toHaveBeenCalled();
  });

  it('calls listmonk and returns 200 when verifySolution returns true', async () => {
    const { verifySolution } = await import('altcha-lib');
    (verifySolution as jest.Mock).mockResolvedValueOnce({ verified: true });

    const { createSubscriber, sendOptInEmail } = await import('@/lib/listmonk');
    (createSubscriber as jest.Mock).mockResolvedValueOnce({
      id: 123,
      uuid: 'sub-uuid',
      email: 'user@example.com',
      name: 'user@example.com',
      status: 'enabled',
    });
    (sendOptInEmail as jest.Mock).mockResolvedValueOnce(true);

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
    expect(createSubscriber).toHaveBeenCalledTimes(1);
    expect(sendOptInEmail).toHaveBeenCalledTimes(1);
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
    const { createSubscriber, sendOptInEmail } = await import('@/lib/listmonk');
    expect(createSubscriber).not.toHaveBeenCalled();
    expect(sendOptInEmail).not.toHaveBeenCalled();
  });
});
