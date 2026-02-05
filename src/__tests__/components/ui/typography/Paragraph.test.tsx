import { render, screen } from '@testing-library/react';

import { Paragraph } from '@/components/ui/typography/Paragraph';

describe('Body', () => {
  it('renders without error', () => {
    render(<Paragraph>Test Body</Paragraph>);
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });

  it('renders with correct size', () => {
    render(<Paragraph size='sm'>Test Body</Paragraph>);
    const paragraph = screen.getByText('Test Body');
    expect(paragraph).toHaveClass('text-sm');
  });

  it('renders with correct color', () => {
    render(<Paragraph color='light'>Test Body</Paragraph>);
    const paragraph = screen.getByText('Test Body');
    expect(paragraph).toHaveClass('text-tertiary');
  });

  it('renders with strong font weight when isStrong is true', () => {
    render(<Paragraph isStrong={true}>Test Body</Paragraph>);
    const paragraph = screen.getByText('Test Body');
    expect(paragraph).toHaveClass('font-semibold');
  });

  it('renders without margin when margin is false', () => {
    render(<Paragraph margin={false}>Test Body</Paragraph>);
    const paragraph = screen.getByText('Test Body');
    expect(paragraph).not.toHaveClass('mb-4');
  });

  it('renders with additional class', () => {
    render(<Paragraph className='additional-class'>Test Body</Paragraph>);
    const paragraph = screen.getByText('Test Body');
    expect(paragraph).toHaveClass('additional-class');
  });
});
