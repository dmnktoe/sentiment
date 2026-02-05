import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': {
        id?: string;
        challengeurl?: string;
        hidefooter?: string;
        hidelogo?: string;
        className?: string;
        style?: React.CSSProperties;
      };
    }
  }

  interface HTMLElementTagNameMap {
    'altcha-widget': HTMLElement & {
      reset: () => void;
    };
  }
}

export {};
