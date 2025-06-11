import Team from '@/components/templates/Team';

export function generateMetadata() {
  // TODO: SEO metadata for the team page
  return {
    title: 'Team',
    description: 'team',
  };
}

export default async function TeamPage() {
  return <Team />;
}
