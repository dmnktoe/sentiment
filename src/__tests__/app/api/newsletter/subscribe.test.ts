/**
 * Tests for newsletter subscribe endpoint validation logic
 * Tests input validation, schema validation, and error handling
 */

import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

describe('Newsletter Subscribe Validation', () => {
  describe('Input Schema Validation', () => {
    it('should validate correct email format', () => {
      const validData = {
        email: 'test@example.com',
        altcha: 'valid-payload-' + 'x'.repeat(50),
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
          altcha: 'valid-payload-' + 'x'.repeat(50),
          privacy: true,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should require privacy consent', () => {
      const data = {
        email: 'test@example.com',
        altcha: 'valid-payload-' + 'x'.repeat(50),
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
        altcha: 'valid-payload-' + 'x'.repeat(50),
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
          altcha: 'valid-payload-' + 'x'.repeat(50),
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
          altcha: 'valid-payload-' + 'x'.repeat(50),
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
          altcha: 'valid-payload-' + 'x'.repeat(50),
          privacy: value,
        };

        const result = newsletterSubscribeSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should accept only true boolean for privacy', () => {
      const data = {
        email: 'test@example.com',
        altcha: 'valid-payload-' + 'x'.repeat(50),
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

    it('should accept valid ALTCHA payload length', () => {
      const validPayload = 'x'.repeat(100); // Sufficient length

      const data = {
        email: 'test@example.com',
        altcha: validPayload,
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept even short but non-empty ALTCHA payloads (detailed validation in route)', () => {
      // The schema only checks for non-empty, detailed length validation happens in the route
      const data = {
        email: 'test@example.com',
        altcha: 'a', // Even single char is OK for schema
        privacy: true,
      };

      const result = newsletterSubscribeSchema.safeParse(data);
      expect(result.success).toBe(true);
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
          altcha: 'valid-payload-' + 'x'.repeat(50),
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
          altcha: 'valid-payload-' + 'x'.repeat(50),
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
