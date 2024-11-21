import ArticleList from '@/components/templates/ArticleList';
import { fetchAPI } from '@/lib/fetch-api';
import { Article } from '@/types/Article';

const ARTICLES_PATH = '/articles';

const QUERY = {
  populate: ['image'],
  sort: 'publishedAt:desc',
};

async function fetchData(path: string) {
  try {
    const data = await fetchAPI(path, QUERY);
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
  const articles: Article[] = await fetchData(ARTICLES_PATH);
  return {
    title: `All (News) Articles (${articles.length}) - Digital. Secure. Sovereign.`,
    description: `Part of the German government's research framework program on IT security "Digital. Secure. Sovereign".`,
  };
}

export default async function HomePage() {
  const articles: Article[] = await fetchData(ARTICLES_PATH);
  return <ArticleList articles={articles} />;
}
