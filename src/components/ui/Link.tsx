'use client';

import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import * as React from 'react';

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'underline';
  external?: boolean;
};

type LinkProps = BaseProps &
  (
    | ({
        href: string;
        external?: false;
      } & Omit<
        React.ComponentProps<typeof NextLink>,
        'href' | 'className' | 'children'
      >)
    | ({
        href: string;
        external: true;
      } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>)
  );

const variantStyles = {
  default:
    'text-text hover:text-secondary transition-colors duration-200 font-medium',
  subtle: 'text-text/70 hover:text-text transition-colors duration-200',
  underline:
    'text-text hover:text-secondary underline underline-offset-4 transition-colors duration-200',
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { children, className = '', variant = 'default', href, external, ...props },
    ref,
  ) => {
    const combinedClasses = `${variantStyles[variant]} ${className}`;

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className={combinedClasses}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        className={combinedClasses}
        {...(props as React.ComponentProps<typeof NextLink>)}
      >
        {children}
      </NextLink>
    );
  },
);

Link.displayName = 'Link';
