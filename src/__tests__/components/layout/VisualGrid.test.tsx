import { render } from '@testing-library/react';
import React from 'react';

import VisualGrid from '@/components/layout/VisualGrid';

describe('VisualGrid', () => {
  it('renders a container div with correct classes', () => {
    const { container } = render(<VisualGrid />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass(
      'fixed',
      'inset-0',
      'z-[-1]',
      'mx-auto',
      'flex',
      'h-full',
      'justify-between',
      'px-2',
    );
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<VisualGrid />);
    expect(asFragment()).toMatchSnapshot();
  });
});
