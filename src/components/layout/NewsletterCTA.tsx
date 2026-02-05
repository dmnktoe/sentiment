import { AltchaScript } from '@/components/helpers/AltchaScript';
import { NewsletterForm } from '@/components/templates/NewsletterForm';
import { Paragraph, Title } from '@/components/ui/typography';

export default function NewsletterCTA() {
  return (
    <>
      <AltchaScript />

      <div
        id='newsletter'
        className='rounded-lg bg-primary/10 p-6 text-center sm:p-10'
      >
        <Title className='mb-4 text-2xl font-semibold sm:text-3xl'>
          Bleiben Sie auf dem Laufenden
        </Title>
        <Paragraph className='mb-6 text-lg sm:mb-8'>
          Abonnieren Sie unseren Newsletter und erhalten Sie die neuesten
          Updates direkt in Ihr Postfach.
        </Paragraph>
        <div className='mx-auto max-w-md'>
          <NewsletterForm />
        </div>
      </div>
    </>
  );
}
