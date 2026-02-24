/**
 * Tests for ThemeToggle component
 */
import { fireEvent, render, screen } from '@testing-library/react';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Mock next-themes
const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock useHasMounted
jest.mock('@/lib/useHasMounted', () => ({
  useHasMounted: jest.fn(),
}));

import { useTheme } from 'next-themes';

import { useHasMounted } from '@/lib/useHasMounted';

const mockUseTheme = useTheme as jest.Mock;
const mockUseHasMounted = useHasMounted as jest.Mock;

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetTheme.mockReset();
  });

  describe('before hydration (not mounted)', () => {
    beforeEach(() => {
      mockUseHasMounted.mockReturnValue(false);
      mockUseTheme.mockReturnValue({
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
      });
    });

    it('renders a placeholder span instead of the button', () => {
      render(<ThemeToggle />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      const span = document.querySelector('span');
      expect(span).toBeInTheDocument();
    });

    it('placeholder contains an invisible child span', () => {
      render(<ThemeToggle />);
      const invisibleSpan = document.querySelector('span span.invisible');
      expect(invisibleSpan).toBeInTheDocument();
    });
  });

  describe('after hydration (mounted)', () => {
    describe('in light mode', () => {
      beforeEach(() => {
        mockUseHasMounted.mockReturnValue(true);
        mockUseTheme.mockReturnValue({
          resolvedTheme: 'light',
          setTheme: mockSetTheme,
        });
      });

      it('renders the toggle button', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      it('displays the moon symbol (☾) in light mode', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveTextContent('☾');
      });

      it('has aria-label "Switch to dark mode" in light mode', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-label',
          'Switch to dark mode',
        );
      });

      it('calls setTheme with "dark" when clicked in light mode', () => {
        render(<ThemeToggle />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockSetTheme).toHaveBeenCalledTimes(1);
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
      });
    });

    describe('in dark mode', () => {
      beforeEach(() => {
        mockUseHasMounted.mockReturnValue(true);
        mockUseTheme.mockReturnValue({
          resolvedTheme: 'dark',
          setTheme: mockSetTheme,
        });
      });

      it('renders the toggle button', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      it('displays the star symbol (✺) in dark mode', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveTextContent('✺');
      });

      it('has aria-label "Switch to light mode" in dark mode', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-label',
          'Switch to light mode',
        );
      });

      it('calls setTheme with "light" when clicked in dark mode', () => {
        render(<ThemeToggle />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockSetTheme).toHaveBeenCalledTimes(1);
        expect(mockSetTheme).toHaveBeenCalledWith('light');
      });
    });

    describe('styling', () => {
      beforeEach(() => {
        mockUseHasMounted.mockReturnValue(true);
        mockUseTheme.mockReturnValue({
          resolvedTheme: 'light',
          setTheme: mockSetTheme,
        });
      });

      it('has the correct base classes', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('rounded-2xl');
        expect(button).toHaveClass('px-2');
        expect(button).toHaveClass('py-1');
      });

      it('has type="button" to prevent accidental form submission', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
      });
    });
  });
});
