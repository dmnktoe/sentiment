import { Container } from '@/components/layout/Container';
import { CookieControlCenter } from '@/components/templates/CookieControlCenter';
import Crossbar from '@/components/templates/Crossbar';
import { Link } from '@/components/ui/Link';
import { List, ListItem } from '@/components/ui/List';
import { Paragraph, Title } from '@/components/ui/typography';

function CookieHero() {
  return (
    <div className='border-b-solid mb-12 border-b-[1px] border-b-grid pb-12 sm:mb-24 sm:pb-24'>
      <div className='grid grid-cols-3 gap-0 sm:grid-cols-4'>
        <div className='z-20 col-span-3 sm:col-span-4'>
          <Title className='leading-none' size='two'>
            Cookie{' '}
            <span className='font-secondary italic text-primary'>Policy</span>
          </Title>
        </div>
        <div className='z-10 col-span-3 mt-8 sm:col-span-4'>
          <Paragraph>
            This page explains which cookies and storage mechanisms we use, what
            happens when you accept or reject them, and how to change your
            choice.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <div className='px-2 sm:px-4'>
          <CookieHero />

          <Title size='five' className='mt-12'>
            1. What are cookies?
          </Title>
          <Paragraph>
            Cookies are small text files that websites place on your device to
            remember information between visits. Similar mechanisms — such as
            <em> localStorage</em>, <em>sessionStorage</em>, or fingerprinting
            pixels — can have the same effect. Where this policy refers to
            &quot;cookies&quot; it covers all of these equivalent technologies.
          </Paragraph>

          <Title size='five' className='mt-12'>
            2. Legal basis and approach
          </Title>
          <Paragraph>
            For strictly necessary cookies we rely on our legitimate interest in
            operating this website (Art. 6 (1) lit. f GDPR, § 25 (2) No. 2
            TTDSG). All other cookies are only set after you have actively
            consented via our cookie dialog (Art. 6 (1) lit. a GDPR, § 25 (1)
            TTDSG). You can withdraw your consent at any time with effect for
            the future.
          </Paragraph>

          <Title size='five' className='mt-12'>
            3. Categories we distinguish
          </Title>
          <Paragraph>
            Our consent manager groups cookies into the following categories.
            You can toggle each category individually in the{' '}
            <Link href='#cookie-settings' variant='underline'>
              Cookie Control Center
            </Link>{' '}
            below.
          </Paragraph>
          <List>
            <ListItem>
              <strong>Necessary</strong> — required for core functionality such
              as route navigation, bot protection (ALTCHA) and remembering your
              consent preference. These cookies cannot be disabled.
            </ListItem>
            <ListItem>
              <strong>Measurement</strong> — privacy-friendly analytics (Umami,
              self-hosted in the EU) that help us understand which research
              content is read. Only loaded after explicit consent.
            </ListItem>
          </List>

          <Title size='five' className='mt-12'>
            4. Third-party services
          </Title>
          <Paragraph>
            Third-party scripts are not loaded until you have granted consent
            for the relevant category. We use c15t to block and unblock these
            scripts so that no tracking request is made before you consent.
          </Paragraph>

          <Title size='five' className='mt-12'>
            5. Retention and deletion
          </Title>
          <Paragraph>
            Your consent record is stored on your device for up to twelve
            months, after which we will ask you again. Category-specific cookies
            follow their own expiry (listed by the individual vendor). You can
            reset everything using the &quot;Reset my choice&quot; link below,
            or by deleting the cookies via your browser settings.
          </Paragraph>

          <Title size='five' className='mt-12'>
            6. Your rights
          </Title>
          <Paragraph>
            Under the GDPR you have the right to access, rectify, and erase your
            personal data, to restrict or object to processing, and to data
            portability. A full overview is available in our{' '}
            <Link href='/privacy' variant='underline'>
              privacy policy
            </Link>
            . To withdraw consent that was previously granted through the cookie
            dialog, use the Cookie Control Center below — no email is required.
          </Paragraph>
        </div>

        <div className='mt-16 sm:mt-24'>
          <CookieControlCenter />
        </div>
      </Container>
    </section>
  );
}
