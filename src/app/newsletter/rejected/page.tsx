import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

export const metadata = {
  title: 'Subscription rejected',
  robots: { index: false, follow: false },
};

export default function NewsletterRejectedPage(): React.ReactElement {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <Title size='two' className='mb-6'>
            Subscription <span className='text-primary'>rejected</span>
          </Title>
          <Paragraph className='mb-8'>
            The unconfirmed subscription has been deleted and your email address
            has been removed from our system. You will not receive any further
            emails regarding this signup.
          </Paragraph>
          <Button href='/'>Back to homepage</Button>
        </div>
      </Container>
    </section>
  );
}
