import { fetchDataWithHandling } from '@/lib/fetch-api';

import HeroIntro from '@/components/templates/HeroIntro';
import LatestWidget from '@/components/templates/LatestWidget';

import { Article } from '@/types/Article';
import { GlobalSettings } from '@/types/Global';
import { Homepage } from '@/types/Homepage';

const HOME_DATA_PATH = '/homepage';
const ARTICLES_PATH = '/articles';
const GLOBAL_SETTINGS_PATH = '/global';

const CONTENT_QUERY = {
  populate: ['heroCoverImage'],
};

const PAGINATION_QUERY = {
  pagination: {
    page: 1,
    pageSize: 3,
  },
  sort: 'createdAt:desc',
};

async function getGlobalSettings(): Promise<GlobalSettings> {
  return await fetchDataWithHandling<GlobalSettings>(
    GLOBAL_SETTINGS_PATH,
    { cache: 'no-store' },
    'Failed to fetch global settings',
  );
}

export async function generateMetadata() {
  const globalSettings: GlobalSettings = await getGlobalSettings();
  return {
    title: globalSettings.pageTitle,
    description: globalSettings.pageDescription,
  };
}

export default async function HomePage() {
  const content = await fetchDataWithHandling<Homepage>(
    HOME_DATA_PATH,
    CONTENT_QUERY,
    `Failed to fetch content from ${HOME_DATA_PATH}`,
  );
  const articles = await fetchDataWithHandling<Article[]>(
    ARTICLES_PATH,
    PAGINATION_QUERY,
    `Failed to fetch articles from ${ARTICLES_PATH}`,
  );

  return (
    <>
      <HeroIntro content={content} />
      <LatestWidget articles={articles} />
    </>
  );
}
