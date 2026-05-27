import type React from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        challenge?: string;
        challengeurl?: string;
        challengeUrl?: string;
        hideLogo?: boolean;
        hidelogo?: boolean;
        hideFooter?: boolean;
        hidefooter?: boolean;
        name?: string;
        strings?: string;
        style?: React.CSSProperties;
      };
    }
  }
}
