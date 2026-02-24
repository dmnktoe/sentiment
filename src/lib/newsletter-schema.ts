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
          return (
            typeof parsed === 'object' &&
            parsed !== null &&
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
