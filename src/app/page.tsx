import Hero from '@/components/templates/Hero';
import Latest from '@/components/templates/Latest';
import { fetchAPI } from '@/lib/fetch-api';

async function getArticles() {
  const path = '/articles';
  const query = {
    pagination: {
      page: 1,
      pageSize: 3,
    },
    sort: 'publishedAt:desc',
  };

  try {
    const data = await fetchAPI(path, query);
    return data.data;
  } catch (error) {
    throw error;
  }
}

export default async function Home() {
  const articles = await getArticles();
  return (
    <>
      <Hero />
      <Latest news={articles} />
    </>
  );
}
