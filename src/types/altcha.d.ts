import type { CSSVariables, WidgetAttributes } from 'altcha/types';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'altcha-widget': WidgetAttributes & {
          children?: React.ReactNode;
          ref?: React.Ref<HTMLElement>;
          style?: Partial<CSSVariables> | React.CSSProperties;
          suppressHydrationWarning?: boolean;
          id?: string;
          className?: string;
          'aria-label'?: string;
        };
      }
    }
  }
}

export {};
