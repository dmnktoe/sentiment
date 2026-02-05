/**
 * Tests for Button component
 */
import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { Button } from '@/components/ui/Button';

// Mock next/link
type MockNextLinkProps = PropsWithChildren<
  { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>
>;

jest.mock('next/link', () => {
  return ({ children, href, ...props }: MockNextLinkProps) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('Button Component', () => {
  describe('As Button Element', () => {
    it('should render button when no href is provided', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should apply custom className', () => {
      render(<Button className='custom-class'>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should handle loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled(); // Should be disabled when loading
    });

    it('should show loading spinner when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('animate-spin');
    });

    it('should forward props to button', () => {
      render(
        <Button type='submit' data-testid='submit-btn'>
          Submit
        </Button>,
      );
      const button = screen.getByTestId('submit-btn');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('As Link (Internal)', () => {
    it('should render as Next.js Link when href is provided', () => {
      render(<Button href='/about'>Go to About</Button>);
      const link = screen.getByRole('link', { name: /go to about/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/about');
    });

    it('should apply shared classes to link', () => {
      render(<Button href='/test'>Link</Button>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-primary');
      expect(link).toHaveClass('border-black');
    });

    it('should show loading spinner on link', () => {
      const { container } = render(
        <Button href='/test' loading>
          Loading Link
        </Button>,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className to link', () => {
      render(
        <Button href='/test' className='link-custom'>
          Link
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('link-custom');
    });
  });

  describe('As External Link', () => {
    it('should render as anchor tag with target="_blank" when external', () => {
      render(
        <Button href='https://example.com' external>
          External
        </Button>,
      );
      const link = screen.getByRole('link', { name: /external/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have noopener noreferrer for security', () => {
      render(
        <Button href='https://evil.com' external>
          External
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should show loading spinner on external link', () => {
      const { container } = render(
        <Button href='https://example.com' external loading>
          Loading External
        </Button>,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className to external link', () => {
      render(
        <Button href='https://example.com' external className='ext-custom'>
          Ext
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('ext-custom');
    });
  });

  describe('Styling', () => {
    it('should have base button styles', () => {
      render(<Button>Styled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('border-black');
      expect(button).toHaveClass('rounded-e-lg');
    });

    it('should have hover styles', () => {
      render(<Button>Hover</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-secondary');
      expect(button).toHaveClass('hover:text-white');
    });

    it('should have focus styles', () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
    });

    it('should have disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('Children and Content', () => {
    it('should render children', () => {
      render(<Button>Child Content</Button>);
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>,
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should render loading spinner before children', () => {
      const { container } = render(<Button loading>Text</Button>);
      const button = container.querySelector('button');
      const firstChild = button?.firstChild;
      expect(firstChild?.nodeName).toBe('svg'); // Loader2 is SVG
    });
  });

  describe('ForwardRef', () => {
    it('should have displayName', () => {
      expect(Button.displayName).toBe('Button');
    });

    it('should forward ref to button', () => {
      const ref = jest.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalled();
    });

    it('should forward ref to link', () => {
      const ref = jest.fn();
      render(
        <Button href='/test' ref={ref}>
          Link
        </Button>,
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('TypeScript Props', () => {
    it('should accept button props', () => {
      render(<Button onClick={() => {}}>Click</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should accept anchor props when href is provided', () => {
      render(
        <Button href='/test' target='_self'>
          Link
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Loading State', () => {
    it('should disable button when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should disable button when both loading and disabled', () => {
      render(
        <Button loading disabled>
          Both
        </Button>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show Loader2 icon when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const loader = container.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<Button>Accessible</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible name', () => {
      render(<Button>Click Me</Button>);
      expect(
        screen.getByRole('button', { name: /click me/i }),
      ).toBeInTheDocument();
    });

    it('should indicate disabled state to screen readers', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('disabled');
    });
  });
});
