import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

export default function NewsletterUnsubscribedPage() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <Title size='two' className='mb-6'>
            Abmeldung <span className='text-primary'>bestätigt</span>
          </Title>
          <Paragraph className='mb-8'>
            Sie wurden erfolgreich vom Newsletter abgemeldet. Schade, dass Sie
            gehen! Falls Sie Ihre Meinung ändern, können Sie sich jederzeit
            wieder anmelden.
          </Paragraph>
          <Button href='/'>Zurück zur Startseite</Button>
        </div>
      </Container>
    </section>
  );
}
