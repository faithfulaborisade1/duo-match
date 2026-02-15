'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onClear, loading = false, value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState('');
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(currentValue);
      }
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('');
      }
      onClear?.();
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      const inputEl = (ref as React.RefObject<HTMLInputElement>)?.current;
      if (inputEl && nativeInputValueSetter) {
        nativeInputValueSetter.call(inputEl, '');
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    return (
      <div className={cn('relative', className)}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M16.5 16.5L12.375 12.375M14.25 8.25C14.25 11.564 11.564 14.25 8.25 14.25C4.936 14.25 2.25 11.564 2.25 8.25C2.25 4.936 4.936 2.25 8.25 2.25C11.564 2.25 14.25 4.936 14.25 8.25Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          ref={ref}
          type="search"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex h-10 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-10 py-2 text-sm',
            'text-neutral-900 placeholder:text-neutral-400',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
            'dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-500'
          )}
          {...props}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
        {!loading && currentValue && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded',
              'dark:hover:text-neutral-300'
            )}
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
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

SearchInput.displayName = 'SearchInput';

export { SearchInput };
