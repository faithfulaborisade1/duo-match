'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const toggleSizes = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-3.5 w-3.5',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-4.5 w-4.5 h-[18px] w-[18px]',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-[52px]',
    thumb: 'h-5 w-5',
    translate: 'translate-x-6',
  },
} as const;

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked = false, onChange, label, size = 'md', disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const toggleId = id || generatedId;

    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <button
          ref={ref}
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5',
            'transition-colors duration-200 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked
              ? 'bg-primary-500'
              : 'bg-neutral-300 dark:bg-neutral-600',
            toggleSizes[size].track
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              'inline-block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out',
              toggleSizes[size].thumb,
              checked ? toggleSizes[size].translate : 'translate-x-0.5'
            )}
          />
        </button>
        {label && (
          <label
            htmlFor={toggleId}
            className={cn(
              'text-sm font-medium text-neutral-700 dark:text-neutral-200 cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };
