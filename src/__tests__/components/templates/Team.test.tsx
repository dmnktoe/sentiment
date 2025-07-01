import { render, screen } from '@testing-library/react';

import Team from '@/components/templates/Team';

describe('Team component', () => {
  it('renders the Team section', () => {
    render(<Team />);
    expect(
      screen.getByRole('heading', { name: /meet the team/i }),
    ).toBeInTheDocument();
  });

  it('renders all team member names', () => {
    render(<Team />);
    // List of all member names from the Team component
    const memberNames = [
      'Dr. Jessica Szczuka',
      'M. Sc. Lisa Mühl',
      'B. Sc. Anna Straub',
      'Prof. Dr. Veelasha Moonsamy',
      'M. Sc. Ramya Kandula',
      'Joel Baumann',
      'Laura Därr',
      'Dr. Maxi Nebel',
      'PD Dr. Christian Geminn',
    ];
    memberNames.forEach((name) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    });
  });

  it('renders images for each team member', () => {
    render(<Team />);
    const images = screen.getAllByRole('img');
    // There should be as many images as team members
    expect(images.length).toBe(9);
    // Check alt text for each image
    expect(images.map((img) => img.getAttribute('alt'))).toEqual([
      'Dr. Jessica Szczuka',
      'M. Sc. Lisa Mühl',
      'B. Sc. Anna Straub',
      'Prof. Dr. Veelasha Moonsamy',
      'M. Sc. Ramya Kandula',
      'Joel Baumann',
      'Laura Därr',
      'Dr. Maxi Nebel',
      'PD Dr. Christian Geminn',
    ]);
  });
});
