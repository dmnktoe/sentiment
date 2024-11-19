import { Container } from '@/components/layout/Container';
import { fetchAPI } from '@/lib/fetch-api';
import { readingDuration } from '@/lib/get-reading-time';

async function getArticle(slug: string) {
  const path = '/articles';
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
  };

  try {
    const data = await fetchAPI(path, query);
    return data.data[0];
  } catch (error) {
    throw error;
  }
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return <p>No member found</p>;

  const article = await getArticle(slug);

  return (
    <section className='py-36 sm:py-48 rounded-tl-[5rem] rounded-tr-[5rem] border-t-solid border-t-4 border-primary/30'>
      <Container>
        {article ? (
          <>
            <div className='grid grid-cols-3 sm:grid-cols-4 pb-6'>
              <div className='text-sm text-primary'>(News)</div>
              <div className='text-sm text-primary'>{new Date(article.publishedAt).toLocaleDateString()}</div>
              <div className='text-sm text-primary'>{readingDuration(article.description)}</div>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-4 gap-0 gap-y-8'>
              <div className='col-span-3'>
                <h1 className='font-secondary text-3xl sm:text-5xl group-hover:underline tracking-tight'>
                  {article.title}
                </h1>
              </div>
              <div className='col-span-3 sm:col-span-1'>
                <div>
                  <ul className='space-y-2 text-sm text-tertiary'>
                    <li>
                      <span className='font-semibold'>Author:</span> Dr. Emily Carter
                    </li>
                    <li>
                      <span className='font-semibold'>Category:</span> Data Security
                    </li>
                    <li>
                      <span className='font-semibold'>Word Count:</span> 2,450 words
                    </li>
                    <li>
                      <span className='font-semibold'>Read Time:</span> 12 minutes
                    </li>
                    <li>
                      <span className='font-semibold'>Peer Reviewed:</span> Yes
                    </li>
                    <li>
                      <span className='font-semibold'>Citations:</span> 35 sources
                    </li>
                    <li>
                      <span className='font-semibold'>Institutional Affiliation:</span> University of Cyber Research
                    </li>
                    <li>
                      <span className='font-semibold'>Funding:</span> CyberTech Grant Program
                    </li>
                    <li>
                      <span className='font-semibold'>Key Findings:</span> Improved data encryption efficiency by 20%
                    </li>
                    <li>
                      <span className='font-semibold'>Keywords:</span> Data Security, Privacy, AI Encryption
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-span-3 sm:col-span-2 sm:-mt-48'>
                <div className='prose leading-7 font-secondary'>{article.description}</div>
              </div>
              <div className='col-span-3 sm:col-span-4'>
                <div className='prose leading-7 font-secondary'>{article.description}</div>
              </div>
            </div>
          </>
        ) : (
          <p>No article found</p>
        )}
      </Container>
    </section>
  );
}
