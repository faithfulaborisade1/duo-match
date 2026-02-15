import * as React from 'react';
import { cn, clamp } from '@/lib/utils';

const progressVariants = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
} as const;

const progressSizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const;

export type ProgressVariant = keyof typeof progressVariants;
export type ProgressSize = keyof typeof progressSizes;

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'primary',
      size = 'md',
      showLabel = false,
      label,
      animated = false,
      ...props
    },
    ref
  ) => {
    const percentage = clamp(Math.round((value / max) * 100), 0, 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {label}
              </span>
            )}
            {showLabel && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {percentage}%
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700',
            progressSizes[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${percentage}%`}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              progressVariants[variant],
              animated && 'animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
