import { render, screen } from '@testing-library/react';

import { Paragraph } from '@/components/ui/typography/Paragraph';

import { metadata } from '@/app/about/page';

describe('AboutPage', () => {
  it('renders without error', () => {
    render(<Paragraph>Test Body</Paragraph>);
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });
  describe('metadata', () => {
    it('has the correct title and description', () => {
      expect(metadata.title).toBe(
        'About » Project Sentiment (dot) org, Support Democracy',
      );
      expect(metadata.description).toBe(
        'Part of the German government\'s research framework program on IT security "Digital. Secure. Sovereign".',
      );
    });
  });
});
