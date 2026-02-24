/**
 * Tests for Header component
 */
import { render, screen } from '@testing-library/react';

import Header from '@/components/layout/Header';

// Mock next/navigation
const mockUsePathname = jest.fn(() => '/');
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

beforeEach(() => {
  mockUsePathname.mockReturnValue('/');
});

describe('Header Component', () => {
  describe('Rendering', () => {
    it('should render header element', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render logo link', () => {
      render(<Header />);
      const logoLink = screen.getByRole('link', { name: 'Go to homepage' });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render navigation', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render About link', () => {
      render(<Header />);
      const aboutLink = screen.getByRole('link', { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('should render Team link', () => {
      render(<Header />);
      const teamLink = screen.getByRole('link', { name: /team/i });
      expect(teamLink).toBeInTheDocument();
      expect(teamLink).toHaveAttribute('href', '/team');
    });

    it('should render Articles link', () => {
      render(<Header />);
      const articlesLink = screen.getByRole('link', { name: /articles/i });
      expect(articlesLink).toBeInTheDocument();
      expect(articlesLink).toHaveAttribute('href', '/articles');
    });

    it('should have all navigation links', () => {
      render(<Header />);
      const navLinks = screen.getAllByRole('link');
      // Should have at least 4 links (logo + 3 nav items)
      expect(navLinks.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Layout', () => {
    it('should be fixed positioned', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('fixed');
    });

    it('should have z-index for layering', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('z-30');
    });

    it('should have rounded design', () => {
      const { container } = render(<Header />);
      const innerContainer = container.querySelector('.rounded-full');
      expect(innerContainer).toBeInTheDocument();
    });

    it('should have backdrop blur effect', () => {
      const { container } = render(<Header />);
      const innerContainer = container.querySelector('.backdrop-blur-md');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have banner role', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have navigation role', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have named navigation links', () => {
      render(<Header />);
      const aboutLink = screen.getByRole('link', { name: /about/i });
      const teamLink = screen.getByRole('link', { name: /team/i });
      const articlesLink = screen.getByRole('link', { name: /articles/i });
      expect(aboutLink).toBeInTheDocument();
      expect(teamLink).toBeInTheDocument();
      expect(articlesLink).toBeInTheDocument();
    });
  });

  describe('Navigation Component', () => {
    it('should render navigation list', () => {
      render(<Header />);
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should render list items for each nav link', () => {
      render(<Header />);
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(3); // About, Team, Articles
    });

    it('should use NavLink components', () => {
      render(<Header />);
      const aboutLink = screen.getByRole('link', { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have white background with opacity', () => {
      const { container } = render(<Header />);
      const innerContainer = container.querySelector('.bg-white\\/85');
      expect(innerContainer).toBeInTheDocument();
    });

    it('should have border', () => {
      const { container } = render(<Header />);
      const innerContainer = container.querySelector('.border-black');
      expect(innerContainer).toBeInTheDocument();
    });

    it('should have shadow', () => {
      const { container } = render(<Header />);
      const innerContainer = container.querySelector('.shadow-sm');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should render without errors', () => {
      const { container } = render(<Header />);
      expect(container).toBeInTheDocument();
    });

    it('should have proper flex layout', () => {
      const { container } = render(<Header />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});
