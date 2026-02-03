import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/icons';
import { Paragraph, Title } from '@/components/ui/typography';

function AboutHero() {
  return (
    <>
      <Title className='leading-none' size='two'>
        About
        <span className='font-secondary italic text-primary'>
          {' '}
          »
        </span> Project{' '}
        <span className='relative inline-flex items-center overflow-hidden rounded-full border-2 border-solid border-black px-3 py-2'>
          <div className='absolute left-0 top-0 h-full w-full bg-primary object-cover' />
          <span className='z-20'>
            <Logo variant='textOnly' className='w-32 sm:w-72' />
          </span>
        </span>{' '}
        <span className='font-secondary italic text-primary'>(dot) org</span>,
        IT Security Protects Privacy and Supports Democracy
        <span className='font-secondary italic text-primary'> «</span>
      </Title>
      <Paragraph>
        SENTIMENT, an interdisciplinary research on self-disclosure in intimate
        communication with text-generative AI, has started! The project is
        funded by the Federal Ministry of Education and Research (BMBF) and is
        scheduled to run over the next three years.
      </Paragraph>
      <Paragraph>
        A consortium comprising esteemed researchers from the disciplines
        psychology (INTITEC), law (Christian Geminn, University of Kassel),
        computer science (Veelasha Moonsamy, Ruhr University Bochum), and art
        (Joel Baumann, University of Kassel), is dedicated to exploring the
        impact of natural language on self-disclosure tendencies and,
        consequently, privacy in intimate communication with large language
        models.
      </Paragraph>
      <Paragraph>
        The primary objective of the project is to explore the tendency for
        self-disclosure in intimate communication through chat systems. The
        emphasis is on empowering users to maintain their privacy and autonomy
        when engaging with such technologies. Concurrently, existing systems
        will undergo security assessments, and adherence to relevant legal
        standards, particularly the labeling requirements outlined in the AI
        Act, will be empirically examined. The findings will yield insights
        crucial for both research and practical application.
      </Paragraph>
      <Paragraph>
        What sets this project apart is its integration of art, which will
        render both the research process and outcomes experiential, thereby
        democratizing science communication for broader accessibility.
      </Paragraph>
    </>
  );
}

export default function About() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <div className='px-2 sm:px-4'>
          <AboutHero />
          <Button href='/team'>team</Button>
        </div>
      </Container>
    </section>
  );
}
