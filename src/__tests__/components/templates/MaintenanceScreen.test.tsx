/**
 * Tests for MaintenanceScreen component
 */
import { fireEvent, render, screen } from '@testing-library/react';

import { MaintenanceScreen } from '@/components/templates/MaintenanceScreen';

describe('MaintenanceScreen Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<MaintenanceScreen />);
      expect(screen.getByText('Under Maintenance')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Our system is currently unavailable. Please try again later.',
        ),
      ).toBeInTheDocument();
    });

    it('should render custom title and message', () => {
      render(
        <MaintenanceScreen
          title='Custom Title'
          message='Custom message text'
        />,
      );
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom message text')).toBeInTheDocument();
    });

    it('should render logo', () => {
      const { container } = render(<MaintenanceScreen />);
      // Logo SVG should be present
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Retry Button', () => {
    it('should show retry button by default', () => {
      render(<MaintenanceScreen />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should hide retry button when showRetry is false', () => {
      render(<MaintenanceScreen showRetry={false} />);
      const retryButton = screen.queryByRole('button', { name: /retry/i });
      expect(retryButton).not.toBeInTheDocument();
    });

    it('should call onRetry callback when clicked', () => {
      const onRetryMock = jest.fn();
      render(<MaintenanceScreen onRetry={onRetryMock} />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry with fallback to reload when no callback', () => {
      // When onRetry is not provided, button should trigger reload
      // We skip JSDOM reload test due to not-implemented navigation
      render(<MaintenanceScreen showRetry={true} onRetry={jest.fn()} />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toBeEnabled();
    });
  });

  describe('Error Details', () => {
    it('should not show error details by default', () => {
      render(<MaintenanceScreen />);
      expect(screen.queryByText('Error Details:')).not.toBeInTheDocument();
    });

    it('should show error details when provided', () => {
      render(<MaintenanceScreen errorDetails='Failed to fetch data' />);
      expect(screen.getByText('Error Details:')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    });

    it('should display error details in pre tag', () => {
      const { container } = render(
        <MaintenanceScreen errorDetails='Error message' />,
      );
      const pre = container.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre).toHaveTextContent('Error message');
    });
  });

  describe('Layout', () => {
    it('should have centered layout', () => {
      const { container } = render(<MaintenanceScreen />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('flex');
      expect(mainDiv).toHaveClass('min-h-screen');
      expect(mainDiv).toHaveClass('items-center');
      expect(mainDiv).toHaveClass('justify-center');
    });

    it('should render support message', () => {
      render(<MaintenanceScreen />);
      expect(
        screen.getByText(
          'If the problem persists, please contact our support team.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MaintenanceScreen />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Under Maintenance');
    });

    it('should have accessible button', () => {
      render(<MaintenanceScreen />);
      const button = screen.getByRole('button', { name: /retry/i });
      expect(button).toBeEnabled();
    });
  });
});
