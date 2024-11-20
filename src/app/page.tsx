import HeroIntro from '@/components/templates/HeroIntro';
import LatestWidget from '@/components/templates/LatestWidget';
import { fetchAPI } from '@/lib/fetch-api';
import { GlobalSettings } from '@/types/Global';

async function getGlobalSettings(): Promise<GlobalSettings> {
  const path = '/global';

  try {
    const data = await fetchAPI(path, { cache: 'no-store' });
    return data.data;
  } catch (error) {
    throw error;
  }
}

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

export async function generateMetadata() {
  const globalSettings: GlobalSettings = await getGlobalSettings();
  return {
    title: globalSettings.pageTitle,
    description: globalSettings.pageDescription,
  };
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
