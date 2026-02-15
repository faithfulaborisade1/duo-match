'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      className,
      name,
      options,
      value,
      onChange,
      label,
      error,
      orientation = 'vertical',
      ...props
    },
    ref
  ) => {
    const safeOptions = Array.isArray(options) ? options : [];

    return (
      <fieldset ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
        {label && (
          <legend className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
            {label}
          </legend>
        )}
        <div
          className={cn(
            'flex gap-3',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
          )}
          role="radiogroup"
        >
          {safeOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-3 cursor-pointer',
                option.disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 cursor-pointer',
                  'text-primary-500 accent-primary-500',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed',
                  error ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'
                )}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p className="text-sm text-error-500" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
