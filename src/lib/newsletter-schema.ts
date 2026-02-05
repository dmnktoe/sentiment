import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  altcha: z.string().min(1, 'Bot verification required'),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Please accept the privacy policy',
  }),
});

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeSchema
>;
