import { Metadata } from 'next';

import Privacy from '@/components/templates/Privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy, Project Sentiment (dot) org',
  description:
    'Part of the German government\'s research framework program on IT security "Digital. Secure. Sovereign".',
};

export default function PrivacyPage() {
  return <Privacy />;
}
