import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  TitleBlock,
  TitleBlock as TitleBlockType,
} from '@/components/strapi/title-block';

// Mock the Title component
jest.mock('@/components/ui/typography/Title', () => ({
  Title: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='title'>{children}</div>
  ),
}));

describe('TitleBlock', () => {
  const mockBlock: TitleBlockType = {
    __component: 'blocks.title',
    id: 1,
    content: 'Test Title Content',
    size: 'two',
    margin: false,
  };

  it('renders the content inside the Title component', () => {
    render(<TitleBlock block={mockBlock} />);
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Title Content');
  });
});
