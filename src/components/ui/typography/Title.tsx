import React from 'react';

import clsxm from '@/lib/clsxm';

type Size = 'one' | 'two' | 'three' | 'four' | 'five';

export interface TitleProps {
  children: React.ReactNode;
  className?: string;
  margin?: boolean;
  renderAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: Size;
}

export const Title = ({
  children,
  className,
  margin = true,
  renderAs = 'h1',
  size = 'one',
}: TitleProps) => {
  const Component = renderAs;

  return (
    <Component
      className={clsxm(
        'font-primary tracking-tighter',
        {
          'text-4xl sm:text-7xl': size === 'one',
          'text-4xl sm:text-6xl': size === 'two',
          'font-secondary text-3xl sm:text-5xl': size === 'three',
          'font-secondary text-2xl sm:text-4xl': size === 'four',
          'font-secondary text-xl sm:text-2xl': size === 'five',
        },
        {
          'mb-2 sm:mb-4': margin,
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
