'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const alertVariants = {
  info: {
    container: 'border-info-200 bg-info-50 text-info-800 dark:border-info-800 dark:bg-info-950/50 dark:text-info-200',
    icon: 'text-info-500',
  },
  success: {
    container: 'border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-950/50 dark:text-success-200',
    icon: 'text-success-500',
  },
  warning: {
    container: 'border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800 dark:bg-warning-950/50 dark:text-warning-200',
    icon: 'text-warning-500',
  },
  error: {
    container: 'border-error-200 bg-error-50 text-error-800 dark:border-error-800 dark:bg-error-950/50 dark:text-error-200',
    icon: 'text-error-500',
  },
} as const;

export type AlertVariant = keyof typeof alertVariants;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      icon,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex gap-3 rounded-lg border p-4',
          alertVariants[variant].container,
          className
        )}
        {...props}
      >
        {icon && (
          <span className={cn('shrink-0 mt-0.5', alertVariants[variant].icon)}>
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold mb-1">{title}</p>
          )}
          {children && (
            <div className="text-sm opacity-90">{children}</div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              'shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label="Dismiss alert"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
