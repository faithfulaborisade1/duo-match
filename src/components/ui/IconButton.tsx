'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const iconButtonVariants = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500',
  secondary:
    'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 focus-visible:ring-secondary-500',
  outline:
    'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-primary-500 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-primary-500 dark:text-neutral-300 dark:hover:bg-neutral-800',
  danger:
    'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 focus-visible:ring-error-500',
} as const;

const iconButtonSizes = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

export type IconButtonVariant = keyof typeof iconButtonVariants;
export type IconButtonSize = keyof typeof iconButtonSizes;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      label,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        iconButtonVariants[variant],
        iconButtonSizes[size],
        className
      )}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  )
);

IconButton.displayName = 'IconButton';

export { IconButton };
