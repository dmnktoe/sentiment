import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        // v3: `challenge` can be a URL or inline JSON challenge.
        challenge?: string;
        // Legacy / alternative spellings used across versions/examples.
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
