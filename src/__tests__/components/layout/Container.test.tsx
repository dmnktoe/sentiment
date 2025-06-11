import { render } from '@testing-library/react';
import React from 'react';

import { Container } from '@/components/layout/Container';

// Mock clsxm to just join class names for testing
jest.mock(
  '@/lib/clsxm',
  () =>
    (...args: string[]) =>
      args.filter(Boolean).join(' '),
);

describe('Container', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Container>
        <span>Test Child</span>
      </Container>,
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('applies default classes and width', () => {
    const { container } = render(<Container>Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('mx-auto');
    expect(div.className).toContain('px-2');
    expect(div.className).toContain('sm:px-4');
    expect(div.className).toContain('max-w-[var(--max-width)]');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className='custom-class'>Content</Container>,
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('custom-class');
  });

  it('applies custom width', () => {
    const { container } = render(
      <Container width='max-w-xl'>Content</Container>,
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-xl');
  });

  it('combines all class names correctly', () => {
    const { container } = render(
      <Container className='foo' width='bar'>
        Content
      </Container>,
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('mx-auto');
    expect(div.className).toContain('px-2');
    expect(div.className).toContain('sm:px-4');
    expect(div.className).toContain('bar');
    expect(div.className).toContain('foo');
  });
});
