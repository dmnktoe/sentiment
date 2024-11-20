import HeroIntro from '@/components/templates/HeroIntro';
import LatestWidget from '@/components/templates/LatestWidget';
import { fetchAPI } from '@/lib/fetch-api';
import { Article } from '@/types/Article';
import { GlobalSettings } from '@/types/Global';
import { Project } from '@/types/Project';

const ARTICLES_PATH = '/articles';
const PROJECTS_PATH = '/projects';
const GLOBAL_SETTINGS_PATH = '/global';

const PAGINATION_QUERY = {
  pagination: {
    page: 1,
    pageSize: 3,
  },
  sort: 'publishedAt:desc',
};

async function getGlobalSettings(): Promise<GlobalSettings> {
  try {
    const data = await fetchAPI(GLOBAL_SETTINGS_PATH, { cache: 'no-store' });
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch global settings: ${error.message}`);
    } else {
      throw new Error('Failed to fetch global settings due to an unknown error.');
    }
  }
}

async function fetchData(path: string) {
  try {
    const data = await fetchAPI(path, PAGINATION_QUERY);
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data from ${path}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch data from ${path} due to an unknown error.`);
    }
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
  const articles: Article[] = await fetchData(ARTICLES_PATH);
  const projects: Project[] = await fetchData(PROJECTS_PATH);
  return (
    <>
      <HeroIntro />
      <LatestWidget articles={articles} projects={projects} />
    </>
  );
}
