import { AltchaScript } from '@/components/helpers/AltchaScript';
import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { NewsletterForm } from '@/components/templates/NewsletterForm';
import { Paragraph, Title } from '@/components/ui/typography';

export default function NewsletterCTA() {
  return (
    <>
      <AltchaScript />
      <section className='py-24 sm:py-36'>
        <Container>
          <Crossbar />
          <div id='newsletter' className='px-2 sm:px-4'>
            <div className='group grid grid-cols-1 gap-8 rounded-lg bg-primary/5 p-8 transition-all hover:bg-primary/10 lg:grid-cols-2 lg:gap-12 lg:p-12'>
              {/* Text Section - Left */}
              <div className='flex flex-col justify-center'>
                <Title
                  renderAs='h2'
                  size='three'
                  className='mb-4 transition-colors group-hover:text-primary'
                >
                  Research Insights <br />
                  Delivered
                </Title>
                <Paragraph className='mb-6 text-base' color='light'>
                  Subscribe to our newsletter and receive the latest updates
                  about the SENTIMENT project directly in your inbox.
                </Paragraph>
                <div className='space-y-2 text-sm text-tertiary'>
                  <p className='flex items-center gap-2'>
                    <span className='text-primary'>✓</span>
                    Regular updates on research findings
                  </p>
                  <p className='flex items-center gap-2'>
                    <span className='text-primary'>✓</span>
                    Insights into current developments
                  </p>
                  <p className='flex items-center gap-2'>
                    <span className='text-primary'>✓</span>
                    Unsubscribe anytime, GDPR compliant
                  </p>
                </div>
              </div>

              {/* Form Section - Right */}
              <div className='flex flex-col justify-center'>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
