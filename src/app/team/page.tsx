import Team from '@/components/templates/Team';

export function generateMetadata() {
  return {
    title: 'Meet the Team of Project SENTIMENT',
    description:
      'Get to know the dedicated team behind Project SENTIMENT, a project focused on exploring the delicate intersection of privacy and intimacy in human-chatbot interactions.',
  };
}

export default async function TeamPage() {
  return <Team />;
}
