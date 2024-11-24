import { Metadata } from 'next';

import ArticleLayout from '@/components/templates/ArticleLayout';
import { fetchAPI } from '@/lib/fetch-api';

const ARTICLE_PATH = '/articles';
const createArticleQuery = (slug: string) => ({
  filters: {
    slug: {
      $eq: slug,
    },
  },
  populate: ['image'],
});

async function getArticle(slug: string) {
  const query = createArticleQuery(slug);
  try {
    const data = await fetchAPI(ARTICLE_PATH, query);
    if (!data.data || data.data.length === 0) {
      throw new Error(`No article found for slug: ${slug}`);
    }
    return data.data[0];
  } catch (error) {
    throw error;
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const article = await getArticle(slug);
  return {
    title: article.title || 'Article',
    description: article.description || '',
  };
};

export const generateStaticParams = async () => {
  const query = { populate: [] };
  const data = await fetchAPI(ARTICLE_PATH, query);

  return data.data.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return <p>No article found</p>;

  return <ArticleLayout article={article} />;
}
