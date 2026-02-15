import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, lines, style, ...props }, ref) => {
    if (lines && lines > 1) {
      return (
        <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded',
                i === lines - 1 && 'w-3/4'
              )}
              style={{
                height: height || '1em',
                width: i === lines - 1 ? '75%' : width || '100%',
                ...style,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-neutral-200 dark:bg-neutral-700',
          variant === 'text' && 'rounded h-4 w-full',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-none',
          variant === 'rounded' && 'rounded-lg',
          className
        )}
        style={{
          width: width || (variant === 'circular' ? '40px' : undefined),
          height: height || (variant === 'circular' ? '40px' : undefined),
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
