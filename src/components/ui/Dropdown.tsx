'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ trigger, items, align = 'right', className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const menuId = React.useId();

    const safeItems = Array.isArray(items) ? items : [];

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    return (
      <div ref={ref || dropdownRef} className={cn('relative inline-block', className)}>
        <div
          ref={dropdownRef}
          className="relative inline-block"
        >
          <div
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-controls={menuId}
          >
            {trigger}
          </div>
          {isOpen && (
            <div
              id={menuId}
              role="menu"
              className={cn(
                'absolute z-50 mt-2 min-w-[180px] rounded-lg border border-neutral-200 bg-white py-1 shadow-lg',
                'dark:border-neutral-700 dark:bg-neutral-800',
                'animate-in fade-in zoom-in-95 duration-150',
                align === 'right' ? 'right-0' : 'left-0'
              )}
            >
              {safeItems.map((item) => {
                if (item.divider) {
                  return (
                    <div
                      key={item.id}
                      className="my-1 h-px bg-neutral-200 dark:bg-neutral-700"
                      role="separator"
                    />
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                      'focus-visible:outline-none focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-700',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      item.danger
                        ? 'text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950/30'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700'
                    )}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export { Dropdown };
