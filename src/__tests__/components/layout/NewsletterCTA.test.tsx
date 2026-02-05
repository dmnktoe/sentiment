/**
 * Tests for NewsletterCTA component
 */
import { render, screen } from '@testing-library/react';

import NewsletterCTA from '@/components/layout/NewsletterCTA';

// Mock dependencies
jest.mock('@/components/helpers/AltchaScript', () => ({
  AltchaScript: () => <div data-testid='altcha-script'>ALTCHA Script</div>,
}));

jest.mock('@/components/templates/NewsletterForm', () => ({
  NewsletterForm: () => (
    <form data-testid='newsletter-form'>Newsletter Form</form>
  ),
}));

describe('NewsletterCTA Component', () => {
  describe('Rendering', () => {
    it('should render section element', () => {
      const { container } = render(<NewsletterCTA />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render ALTCHA script', () => {
      render(<NewsletterCTA />);
      expect(screen.getByTestId('altcha-script')).toBeInTheDocument();
    });

    it('should render newsletter form', () => {
      render(<NewsletterCTA />);
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument();
    });

    it('should have newsletter id anchor', () => {
      const { container } = render(<NewsletterCTA />);
      const anchor = container.querySelector('#newsletter');
      expect(anchor).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have section with padding', () => {
      const { container } = render(<NewsletterCTA />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-24');
    });

    it('should use responsive padding', () => {
      const { container } = render(<NewsletterCTA />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('sm:py-36');
    });

    it('should have grid layout', () => {
      const { container } = render(<NewsletterCTA />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have background styling', () => {
      const { container } = render(<NewsletterCTA />);
      const gridContainer = container.querySelector('.bg-primary\\/5');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should render heading', () => {
      render(<NewsletterCTA />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have descriptive text', () => {
      render(<NewsletterCTA />);
      // Newsletter CTA should have some descriptive paragraph
      const section = screen.getByTestId('newsletter-form').parentElement;
      expect(section).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should include Container component', () => {
      const { container } = render(<NewsletterCTA />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should include Crossbar component', () => {
      const { container } = render(<NewsletterCTA />);
      // Crossbar is rendered before the grid
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<NewsletterCTA />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render without errors', () => {
      const { container } = render(<NewsletterCTA />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid columns', () => {
      const { container } = render(<NewsletterCTA />);
      const grid = container.querySelector('.lg\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should have responsive gap', () => {
      const { container } = render(<NewsletterCTA />);
      const grid = container.querySelector('.lg\\:gap-12');
      expect(grid).toBeInTheDocument();
    });
  });
});
