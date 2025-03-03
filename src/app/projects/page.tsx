import ProjectList from '@/components/templates/ProjectList';
import { fetchAPI } from '@/lib/fetch-api';
import { Project } from '@/types/Project';

const PROJECTS_PATH = '/projects';

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
      throw new Error(
        `Failed to fetch data from ${path} due to an unknown error.`
      );
    }
  }
}

export async function generateMetadata() {
  const articles: Project[] = await fetchData(PROJECTS_PATH);
  return {
    title: `All (News) Projects (${articles.length}) - Digital. Secure. Sovereign.`,
    description: `Part of the German government's research framework program on IT security "Digital. Secure. Sovereign".`,
  };
}

export default async function ProjectsPage() {
  const projects: Project[] = await fetchData(PROJECTS_PATH);
  return <ProjectList projects={projects} />;
}
