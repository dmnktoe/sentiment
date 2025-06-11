import { Metadata } from 'next';

import LegalNotice from '@/components/templates/LegalNotice';

export const metadata: Metadata = {
  title: 'Legal Notice and Contact Person, Project Sentiment (dot) org',
  description:
    'Part of the German government\'s research framework program on IT security "Digital. Secure. Sovereign".',
};

export default function LegalNoticePage() {
  return <LegalNotice />;
}
