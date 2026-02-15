'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'neutral';
  removable?: boolean;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant = 'filled',
      color = 'primary',
      removable = false,
      onRemove,
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const colorClasses = {
      filled: {
        primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
        secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
        neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
      },
      outlined: {
        primary: 'border border-primary-300 text-primary-700 dark:border-primary-700 dark:text-primary-300',
        secondary: 'border border-secondary-300 text-secondary-700 dark:border-secondary-700 dark:text-secondary-300',
        neutral: 'border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-200',
      },
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium',
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
          colorClasses[variant][color],
          className
        )}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={cn(
              'ml-0.5 -mr-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label="Remove tag"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 2L2 6M2 2L6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

export { Tag };
