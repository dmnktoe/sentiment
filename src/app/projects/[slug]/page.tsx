import { Metadata } from 'next';

import ProjectLayout from '@/components/templates/ProjectLayout';
import { fetchAPI } from '@/lib/fetch-api';

const PROJECT_PATH = '/projects';
const createProjectQuery = (slug: string) => ({
  filters: {
    slug: {
      $eq: slug,
    },
  },
  populate: ['image'],
});

async function getProject(slug: string) {
  const query = createProjectQuery(slug);
  try {
    const data = await fetchAPI(PROJECT_PATH, query);
    if (!data.data || data.data.length === 0) {
      throw new Error(`No project found for slug: ${slug}`);
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
  const project = await getProject(slug);
  return {
    title: project.title || 'Project',
    description: project.description || '',
  };
};

export const generateStaticParams = async () => {
  const query = { populate: [] };
  const data = await fetchAPI(PROJECT_PATH, query);

  return data.data.map((project: { slug: string }) => ({
    slug: project.slug,
  }));
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return <p>No project found</p>;

  return <ProjectLayout project={project} />;
}
