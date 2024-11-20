import { Container } from '@/components/layout/Container';
import { Title } from '@/components/ui/typography/Title';

export default function AboutPage() {
  return (
    <section className='py-36 sm:py-48'>
      <Container>
        <Title className='leading-none'>
          About
          <span className='text-primary font-secondary italic'> »</span> Project Sentiment (dot) org
          <span className='text-primary font-secondary italic'> «</span>
        </Title>
      </Container>
    </section>
  );
}
