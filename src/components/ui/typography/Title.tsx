import React from 'react';

import clsxm from '@/lib/clsxm';

type Size = 'one' | 'two' | 'three' | 'four' | 'five';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  margin?: boolean;
  renderAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: Size;
}

export const Title = ({ children, className, margin = true, renderAs = 'h1', size = 'one' }: TitleProps) => {
  const Component = renderAs;

  return (
    <Component
      className={clsxm(
        'font-medium -tracking-[0.033em] text-dark',
        {
          'text-4xl md:text-5xl md:leading-[1.1] 2xl:text-[3.4rem]': size === 'one',
          'text-3xl md:text-4xl': size === 'two',
          'text-2xl md:text-3xl': size === 'three',
          'text-xl md:text-2xl': size === 'four',
          'text-lg md:text-xl': size === 'five',
        },
        {
          'mb-4': margin,
        },
        className
      )}
    >
      {children}
    </Component>
  );
};
