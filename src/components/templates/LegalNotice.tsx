import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Title } from '@/components/ui/typography/Title';

export default function LegalNotice() {
  return (
    <section className='py-36'>
      <Container>
        <Crossbar />
        <Title className='leading-none'>
          Legal Notice and
          <br />
          Contact Person
        </Title>
        <p className='mt-8 text-sm text-tertiary text-justify'>
          The project is a non-profit organization that aims to protect the
          privacy of individuals and support democracy by providing IT security
          solutions. We are a team of IT security experts who are passionate
          about protecting the privacy of individuals and supporting democracy.
          Our mission is to provide IT security solutions that protect the
          privacy of individuals and support democracy. We believe that everyone
          has the right to privacy and that democracy is essential for a free
          and open society. We are committed to providing IT security solutions
          that help protect the privacy of individuals and support democracy.
        </p>
      </Container>
    </section>
  );
}
