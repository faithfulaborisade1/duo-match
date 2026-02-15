'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = 'top', delay = 200, className }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = React.useId();

    const show = () => {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setVisible(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        className="relative inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {React.cloneElement(children, {
          'aria-describedby': visible ? tooltipId : undefined,
        })}
        {visible && (
          <div
            id={tooltipId}
            role="tooltip"
            className={cn(
              'absolute z-50 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium',
              'bg-neutral-900 text-white shadow-md',
              'dark:bg-neutral-100 dark:text-neutral-900',
              'animate-in fade-in zoom-in-95 duration-150',
              'pointer-events-none',
              positionClasses[position],
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
