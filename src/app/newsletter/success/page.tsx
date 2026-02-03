import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

export default function NewsletterSuccessPage() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <Title size='two' className='mb-6'>
            Anmeldung <span className='text-primary'>bestätigt</span>
          </Title>
          <Paragraph className='mb-8'>
            Vielen Dank! Ihre Newsletter-Anmeldung wurde erfolgreich bestätigt.
            Sie erhalten ab sofort unsere neuesten Updates.
          </Paragraph>
          <Button href='/'>Zurück zur Startseite</Button>
        </div>
      </Container>
    </section>
  );
}
