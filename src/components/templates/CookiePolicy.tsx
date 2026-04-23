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
            <span className='font-secondary italic text-primary'>Policy</span> &{' '}
            <span className='font-secondary italic text-primary'>
              Transparency
            </span>{' '}
            — what we store, for how long, and why
          </Title>
        </div>
        <div className='z-10 col-span-3 mt-8 sm:col-span-4'>
          <Paragraph>
            Because our research engages with sensitive questions of privacy and
            intimacy, we treat cookies the same way: with care, clear purpose,
            and explicit consent. This page explains which cookies and browser
            storage items we use, what happens when you accept or reject them,
            and how you can change your choice later.
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
              as route navigation, security protection (e.g. the ALTCHA bot
              challenge), and remembering your consent preference. These cookies
              cannot be disabled.
            </ListItem>
            <ListItem>
              <strong>Measurement</strong> — anonymous analytics that help us
              understand which research content is read and where users get
              stuck. Only loaded after explicit consent; Google Consent Mode v2
              defaults are set to &quot;denied&quot; until then.
            </ListItem>
            <ListItem>
              <strong>Marketing</strong> — currently unused. Reserved for future
              conversion or remarketing tags; will remain inactive unless and
              until this policy is updated and you consent.
            </ListItem>
          </List>

          <Title size='five' className='mt-12'>
            4. Third-party services
          </Title>
          <Paragraph>
            Third-party scripts (e.g. Google Analytics 4 via{' '}
            <code>gtag.js</code>) are not loaded until you have granted consent
            for the relevant category. We use the c15t script loader to block
            and unblock these scripts in real time so that no tracking network
            request is made while you have not yet consented.
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
