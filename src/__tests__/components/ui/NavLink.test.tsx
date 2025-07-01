import { render, screen } from '@testing-library/react';

import NavLink from '@/components/ui/NavLink';

describe('NavLink', () => {
  it('renders without error', () => {
    render(<NavLink href='/'>Home</NavLink>);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
