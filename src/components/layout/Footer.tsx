import { fetchAPI } from '@/lib/fetch-api';

import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/ui/icons/Logo';
import { Link } from '@/components/ui/Link';

import { Article } from '@/types/Article';

async function getLatestArticles(): Promise<Article[]> {
  try {
    const data = await fetchAPI('/articles', {
      populate: ['image'],
      sort: 'createdAt:desc',
      pagination: { limit: 4 },
    });
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Footer() {
  const latestArticles = await getLatestArticles();

  return (
    <footer className='border-t-solid border-t-4 border-primary/30 py-24'>
      <Container>
        <div className='px-2 sm:px-4'>
          <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5'>
            {/* Logo & Description */}
            <div className='lg:col-span-2'>
              <Link
                href='/'
                className='inline-block text-black transition-colors ease-in-out hover:text-primary'
              >
                <Logo variant='logoWithText' />
              </Link>
              <p className='mt-4 max-w-md text-sm leading-relaxed text-tertiary'>
                SENTIMENT is a research project exploring the intersection of
                technology, emotions, and digital communication in online
                spaces.
              </p>
            </div>

            {/* Latest Articles */}
            <div>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-text'>
                Latest Articles
              </h3>
              {latestArticles.length > 0 ? (
                <ul className='space-y-3 text-base'>
                  {latestArticles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className='line-clamp-2 text-tertiary transition-colors hover:text-primary hover:underline'
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-tertiary'>No articles yet.</p>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-text'>
                Navigate
              </h3>
              <ul className='space-y-3 text-base'>
                <li>
                  <Link
                    href='/about'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='/team'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href='/articles'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href='/#newsletter'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    Newsletter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-text'>
                Legal
              </h3>
              <ul className='space-y-3 text-base'>
                <li>
                  <Link
                    href='/legal-notice'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    Imprint
                  </Link>
                </li>
                <li>
                  <Link
                    href='/privacy'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contact'
                    className='text-tertiary transition-colors hover:text-primary hover:underline'
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='mt-12 border-t border-grid pt-8 text-center text-sm text-tertiary'>
            <p>
              © {new Date().getFullYear()} SENTIMENT Project. All rights
              reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
