import HeroIntro from '@/components/templates/HeroIntro';
import LatestWidget from '@/components/templates/LatestWidget';
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

export default async function HomePage() {
  const articles = await getArticles();
  return (
    <>
      <HeroIntro />
      <LatestWidget articles={articles} />
    </>
  );
}
