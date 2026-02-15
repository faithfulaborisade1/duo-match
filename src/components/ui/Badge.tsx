import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default:
    'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
  primary:
    'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  secondary:
    'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
  success:
    'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  warning:
    'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  error:
    'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  info:
    'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
} as const;

const badgeSizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1',
} as const;

export type BadgeVariant = keyof typeof badgeVariants;
export type BadgeSize = keyof typeof badgeSizes;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'error' && 'bg-error-500',
            variant === 'info' && 'bg-info-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'secondary' && 'bg-secondary-500',
            variant === 'default' && 'bg-neutral-500'
          )}
          aria-hidden="true"
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'ml-0.5 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
          )}
          aria-label="Remove"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  )
);

Badge.displayName = 'Badge';

export { Badge };
