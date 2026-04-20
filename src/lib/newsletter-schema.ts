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
          const parsed = JSON.parse(atob(val));
          // ALTCHA widget v3 / altcha-lib v2 payload shape:
          // base64(JSON({ challenge: { parameters, signature }, solution }))
          return (
            typeof parsed === 'object' &&
            parsed !== null &&
            !Array.isArray(parsed) &&
            typeof parsed.challenge === 'object' &&
            parsed.challenge !== null &&
            typeof parsed.solution === 'object' &&
            parsed.solution !== null
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
