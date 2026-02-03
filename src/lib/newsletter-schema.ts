import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'E-Mail ist erforderlich')
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  altcha: z.string().min(1, 'Bot-Verifizierung erforderlich'),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Bitte akzeptieren Sie die Datenschutzerklärung',
  }),
});

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeSchema
>;
