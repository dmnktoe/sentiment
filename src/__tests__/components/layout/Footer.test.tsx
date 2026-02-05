/**
 * Tests for Footer component
 */
import { render, screen } from '@testing-library/react';

import Footer from '@/components/layout/Footer';

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('should render footer element', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render logo', () => {
      render(<Footer />);
      // Logo should be present (SVG or image)
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have proper semantic HTML', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });
  });

  describe('Layout', () => {
    it('should contain Container component', () => {
      const { container } = render(<Footer />);
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should have border styling', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('border-t-solid');
    });

    it('should have padding', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('py-24');
    });
  });

  describe('Links', () => {
    it('should render navigation links', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have Legal Notice link', () => {
      render(<Footer />);
      const legalLink = screen.getByRole('link', { name: /impressum/i });
      expect(legalLink).toBeInTheDocument();
      expect(legalLink).toHaveAttribute('href', '/legal-notice');
    });

    it('should have Privacy link', () => {
      render(<Footer />);
      const privacyLink = screen.getByRole('link', { name: /datenschutz/i });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should have Contact link', () => {
      render(<Footer />);
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', '/contact');
    });
  });

  describe('Accessibility', () => {
    it('should have contentinfo role', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have accessible link list', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Structure', () => {
    it('should render without errors', () => {
      const { container } = render(<Footer />);
      expect(container).toBeInTheDocument();
    });

    it('should have grid layout', () => {
      const { container } = render(<Footer />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });
});
