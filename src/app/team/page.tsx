import Team from '@/components/templates/Team';

export function generateMetadata() {
  return {
    title: `Team`,
    description: `team`,
  };
}

export default async function TeamPage() {
  return <Team />;
}
