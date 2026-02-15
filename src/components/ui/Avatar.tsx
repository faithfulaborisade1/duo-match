'use client';

import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

const avatarSizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
} as const;

export type AvatarSize = keyof typeof avatarSizes;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
} as const;

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', status, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const initials = name ? getInitials(name) : '?';

    React.useEffect(() => {
      setImgError(false);
    }, [src]);

    const showImage = src && !imgError;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center rounded-full',
          'bg-primary-100 text-primary-700 font-medium',
          'dark:bg-primary-900/30 dark:text-primary-300',
          'select-none overflow-hidden',
          avatarSizes[size],
          className
        )}
        aria-label={alt || name || 'Avatar'}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-neutral-800',
              statusColors[status],
              size === 'xs' && 'h-1.5 w-1.5',
              size === 'sm' && 'h-2 w-2',
              size === 'md' && 'h-2.5 w-2.5',
              size === 'lg' && 'h-3 w-3',
              size === 'xl' && 'h-3.5 w-3.5',
              size === '2xl' && 'h-4 w-4'
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, size = 'md', ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = max ? childArray.slice(0, max) : childArray;
    const remainingCount = max ? Math.max(0, childArray.length - max) : 0;

    return (
      <div
        ref={ref}
        className={cn('flex -space-x-2', className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div key={index} className="ring-2 ring-white dark:ring-neutral-800 rounded-full">
            {child}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'relative inline-flex shrink-0 items-center justify-center rounded-full',
              'bg-neutral-200 text-neutral-600 font-medium',
              'dark:bg-neutral-700 dark:text-neutral-300',
              'ring-2 ring-white dark:ring-neutral-800',
              avatarSizes[size]
            )}
          >
            <span className="text-[0.65em]">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
