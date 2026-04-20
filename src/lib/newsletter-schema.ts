import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  altcha: z
    .string()
    .min(100, 'Bot verification required')
    .refine(
      (val) => {
        try {
          const decoded = atob(val);
          const parsed = JSON.parse(decoded);
          if (
            typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed)
          ) {
            return false;
          }
          // ALTCHA v2/widget v3 payload shape
          if (
            'challenge' in parsed &&
            'solution' in parsed &&
            typeof parsed.challenge === 'object' &&
            parsed.challenge !== null &&
            typeof parsed.solution === 'object' &&
            parsed.solution !== null
          ) {
            return true;
          }
          // ALTCHA v1 payload shape (for backwards compatibility with existing flows)
          return (
            'algorithm' in parsed &&
            'challenge' in parsed &&
            'number' in parsed &&
            'salt' in parsed &&
            'signature' in parsed
          );
        } catch {
          return false;
        }
      },
      { message: 'Invalid bot verification token' },
    ),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Please accept the privacy policy',
  }),
});

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeSchema
>;
