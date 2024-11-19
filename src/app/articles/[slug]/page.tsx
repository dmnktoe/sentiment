import { Metadata } from 'next';

import { Container } from '@/components/layout/Container';
import ArticleTemplate from '@/components/templates/ArticleTemplate';
import { fetchAPI } from '@/lib/fetch-api';

export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};

async function getArticle(slug: string) {
  const path = '/articles';
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ['image'],
  };

  try {
    const data = await fetchAPI(path, query);

    console.log(data);
    return data.data[0];
  } catch (error) {
    throw error;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return <p>No member found</p>;

  const article = await getArticle(slug);

  return (
    <section className='py-36 sm:py-48 rounded-tl-[5rem] rounded-tr-[5rem] border-t-solid border-t-4 border-primary/30'>
      <Container>
        <ArticleTemplate article={article} />
      </Container>
    </section>
  );
}
