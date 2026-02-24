'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import * as React from 'react';

type BaseProps = {
  loading?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  external?: boolean;
};

type ButtonOrLinkProps =
  | ({
      href?: undefined;
    } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({
      href: string;
      external?: boolean;
    } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onCopy'>);

export type ButtonProps = BaseProps & ButtonOrLinkProps;

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    { loading, className = '', children, href, disabled, external, ...props },
    ref,
  ) => {
    const sharedClasses = `cursor-pointer bg-primary border-black dark:border-white/20 border-solid border inline-flex items-center justify-center px-6 py-1 lowercase rounded-e-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white/50 dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed ${className} hover:bg-secondary hover:text-white`;

    if (href) {
      if (external) {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className={sharedClasses}
            {...props}
          >
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={sharedClasses}
          {...(props as Omit<
            AnchorHTMLAttributes<HTMLAnchorElement>,
            'onCopy'
          >)}
        >
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || loading}
        className={sharedClasses}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
