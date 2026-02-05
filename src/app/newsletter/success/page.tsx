import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

export default function NewsletterSuccessPage() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <Title size='two' className='mb-6'>
            Subscription <span className='text-primary'>confirmed</span>
          </Title>
          <Paragraph className='mb-8'>
            Thank you! Your newsletter subscription has been successfully
            confirmed. You will now receive our latest updates.
          </Paragraph>
          <Button href='/'>Back to homepage</Button>
        </div>
      </Container>
    </section>
  );
}
