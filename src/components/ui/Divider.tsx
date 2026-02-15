import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (label && orientation === 'horizontal') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center gap-3', className)}
          role="separator"
          aria-orientation={orientation}
          {...props}
        >
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {label}
          </span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'horizontal'
            ? 'h-px w-full bg-neutral-200 dark:bg-neutral-700'
            : 'w-px h-full bg-neutral-200 dark:bg-neutral-700 self-stretch',
          className
        )}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
