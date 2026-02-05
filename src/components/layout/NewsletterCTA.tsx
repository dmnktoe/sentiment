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
              {/* Text Sektion - Links */}
              <div className='flex flex-col justify-center'>
                <Title
                  size='three'
                  className='mb-4 transition-colors group-hover:text-primary'
                >
                  Bleiben Sie auf dem Laufenden
                </Title>
                <Paragraph className='mb-6 text-base' color='light'>
                  Abonnieren Sie unseren Newsletter und erhalten Sie die
                  neuesten Updates über das SENTIMENT-Projekt direkt in Ihr
                  Postfach.
                </Paragraph>
                <div className='space-y-2 text-sm text-tertiary'>
                  <p className='flex items-center gap-2'>
                    <span className='text-primary'>✓</span>
                    Regelmäßige Updates zu Forschungsergebnissen
                  </p>
                  <p className='flex items-center gap-2'>
                    <span className='text-primary'>✓</span>
                    Einblicke in aktuelle Entwicklungen
                  </p>
                  <p className='flex items-center gap-2'>
                    <span className='text-primary'>✓</span>
                    Jederzeit abbestellbar, DSGVO-konform
                  </p>
                </div>
              </div>

              {/* Form Sektion - Rechts */}
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
