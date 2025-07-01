import { render, screen } from '@testing-library/react';

import { Title } from '@/components/ui/typography/Title';

describe('Title', () => {
  it('renders without error', () => {
    render(<Title>Test Title</Title>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with correct size', () => {
    render(<Title size='two'>Test Title</Title>);
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-4xl');
  });

  it('renders without margin when margin is false', () => {
    render(<Title margin={false}>Test Title</Title>);
    const title = screen.getByText('Test Title');
    expect(title).not.toHaveClass('mb-4');
  });

  it('renders with additional class', () => {
    render(<Title className='additional-class'>Test Title</Title>);
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('additional-class');
  });

  it('renders with correct HTML element', () => {
    render(<Title renderAs='h2'>Test Title</Title>);
    const title = screen.getByText('Test Title');
    expect(title.tagName).toBe('H2');
  });

  it('renders with default HTML element', () => {
    render(<Title>Test Title</Title>);
    const title = screen.getByText('Test Title');
    expect(title.tagName).toBe('H1'); // Default is h1
  });
});
