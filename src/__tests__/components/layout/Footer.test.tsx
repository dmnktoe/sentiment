/**
 * Tests for Footer component
 */
import { render, screen } from '@testing-library/react';

import Footer from '@/components/layout/Footer';

// Mock fetchAPI
jest.mock('@/lib/fetch-api', () => ({
  fetchAPI: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock fetchAPI
import * as fetchAPIModule from '@/lib/fetch-api';
jest.mock('@/lib/fetch-api');

describe('Footer Component', () => {
  const mockFetchAPI = jest.mocked(fetchAPIModule.fetchAPI);

  beforeEach(() => {
    mockFetchAPI.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render footer element', async () => {
      const FooterResolved = await Footer();
      const { container } = render(FooterResolved);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render logo', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      // Logo should be present (SVG or image)
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have proper semantic HTML', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });
  });

  describe('Layout', () => {
    it('should contain Container component', async () => {
      const FooterResolved = await Footer();
      const { container } = render(FooterResolved);
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should have border styling', async () => {
      const FooterResolved = await Footer();
      const { container } = render(FooterResolved);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('border-t-solid');
    });

    it('should have padding', async () => {
      const FooterResolved = await Footer();
      const { container } = render(FooterResolved);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('py-24');
    });
  });

  describe('Links', () => {
    it('should render navigation links', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have Legal Notice link', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const legalLink = screen.getByRole('link', { name: /imprint/i });
      expect(legalLink).toBeInTheDocument();
      expect(legalLink).toHaveAttribute('href', '/legal-notice');
    });

    it('should have Privacy link', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should have Contact link', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', '/contact');
    });
  });

  describe('Accessibility', () => {
    it('should have contentinfo role', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have accessible link list', async () => {
      const FooterResolved = await Footer();
      render(FooterResolved);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Structure', () => {
    it('should render without errors', async () => {
      const FooterResolved = await Footer();
      const { container } = render(FooterResolved);
      expect(container).toBeInTheDocument();
    });

    it('should have grid layout', async () => {
      const FooterResolved = await Footer();
      const { container } = render(FooterResolved);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });
});
