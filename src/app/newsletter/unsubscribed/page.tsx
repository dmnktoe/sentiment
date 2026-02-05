import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

export default function NewsletterUnsubscribedPage() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <Title size='two' className='mb-6'>
            Unsubscription <span className='text-primary'>confirmed</span>
          </Title>
          <Paragraph className='mb-8'>
            You have been successfully unsubscribed from the newsletter. We are
            sorry to see you go! If you change your mind, you can subscribe
            again at any time.
          </Paragraph>
          <Button href='/'>Back to homepage</Button>
        </div>
      </Container>
    </section>
  );
}
