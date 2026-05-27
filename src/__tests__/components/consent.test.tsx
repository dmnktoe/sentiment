import { fireEvent, render, screen } from '@testing-library/react';

import { ConsentManager } from '@/components/helpers/ConsentManager';
import { ConsentCategoryWidget } from '@/components/templates/ConsentCategoryWidget';
import { CookieControlCenter } from '@/components/templates/CookieControlCenter';
import CookiePolicy from '@/components/templates/CookiePolicy';

import CookiesPage from '@/app/cookies/page';

describe('ConsentManager', () => {
  it('renders children', () => {
    render(
      <ConsentManager>
        <p>child content</p>
      </ConsentManager>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('does not render banner when activeUI is none', () => {
    const { container } = render(
      <ConsentManager>
        <div />
      </ConsentManager>,
    );
    expect(
      container.querySelector('[data-testid="consent-banner"]'),
    ).not.toBeInTheDocument();
  });
});

describe('ConsentCategoryWidget', () => {
  it('renders all categories', () => {
    render(<ConsentCategoryWidget />);
    expect(screen.getByText('Strictly Necessary')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('shows "Always on" badge for necessary category', () => {
    render(<ConsentCategoryWidget />);
    expect(screen.getByText('Always on')).toBeInTheDocument();
  });

  it('expands accordion on click and shows vendors', () => {
    render(<ConsentCategoryWidget />);
    const necessaryButton = screen.getByText('Strictly Necessary');
    fireEvent.click(necessaryButton);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('c15t Consent Manager')).toBeInTheDocument();
    expect(screen.getByText('ALTCHA')).toBeInTheDocument();
    expect(screen.getByText('Vercel')).toBeInTheDocument();
  });

  it('expands analytics and shows Umami vendor', () => {
    render(<ConsentCategoryWidget />);
    fireEvent.click(screen.getByText('Analytics'));
    expect(screen.getByText('Umami Analytics')).toBeInTheDocument();
  });

  it('toggles consent on switch click', () => {
    render(<ConsentCategoryWidget />);
    const switches = screen.getAllByRole('switch');
    const analyticsSwitch = switches[1];
    expect(analyticsSwitch).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(analyticsSwitch);
  });

  it('disables toggle for necessary category', () => {
    render(<ConsentCategoryWidget />);
    const switches = screen.getAllByRole('switch');
    expect(switches[0]).toBeDisabled();
  });
});

describe('CookieControlCenter', () => {
  it('renders heading with logo', () => {
    render(<CookieControlCenter />);
    expect(screen.getByText('Cookie Control Center')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<CookieControlCenter />);
    expect(screen.getByText('accept all')).toBeInTheDocument();
    expect(screen.getByText('reject non-essential')).toBeInTheDocument();
    expect(screen.getByText('save preferences')).toBeInTheDocument();
    expect(screen.getByText('Reset my choice')).toBeInTheDocument();
  });

  it('calls saveConsents on button click', () => {
    render(<CookieControlCenter />);
    fireEvent.click(screen.getByText('accept all'));
    fireEvent.click(screen.getByText('reject non-essential'));
    fireEvent.click(screen.getByText('save preferences'));
    fireEvent.click(screen.getByText('Reset my choice'));
  });

  it('renders category widget inline', () => {
    render(<CookieControlCenter />);
    expect(screen.getByText('Strictly Necessary')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });
});

describe('CookiePolicy', () => {
  it('renders the page', () => {
    const { container } = render(<CookiePolicy />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders the hero title', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/Policy/)).toBeInTheDocument();
  });

  it('renders policy sections', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/What are cookies/)).toBeInTheDocument();
    expect(screen.getByText(/Legal basis/)).toBeInTheDocument();
    expect(screen.getByText(/Categories we distinguish/)).toBeInTheDocument();
  });

  it('renders Cookie Control Center', () => {
    render(<CookiePolicy />);
    const centers = screen.getAllByText('Cookie Control Center');
    expect(centers.length).toBeGreaterThan(0);
  });
});

describe('CookiesPage', () => {
  it('renders the page component', () => {
    const { container } = render(<CookiesPage />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
