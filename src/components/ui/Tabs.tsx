'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      tabs,
      activeTab,
      onTabChange,
      variant = 'underline',
      size = 'md',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const safeTabs = Array.isArray(tabs) ? tabs : [];

    const tabSizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-5 py-2.5',
    };

    const getTabClasses = (tab: Tab) => {
      const isActive = tab.id === activeTab;
      const baseClasses = cn(
        'inline-flex items-center gap-2 font-medium transition-colors duration-150 whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-sm',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        tabSizes[size],
        fullWidth && 'flex-1 justify-center'
      );

      if (variant === 'underline') {
        return cn(
          baseClasses,
          'border-b-2 -mb-px',
          isActive
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-200'
        );
      }

      if (variant === 'pills') {
        return cn(
          baseClasses,
          'rounded-lg',
          isActive
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
        );
      }

      if (variant === 'enclosed') {
        return cn(
          baseClasses,
          'rounded-t-lg border border-b-0',
          isActive
            ? 'bg-white border-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50'
            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
        );
      }

      return baseClasses;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          variant === 'underline' && 'border-b border-neutral-200 dark:border-neutral-700',
          variant === 'pills' && 'gap-1 bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-lg',
          className
        )}
        role="tablist"
        {...props}
      >
        {safeTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeTab}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            className={getTabClasses(tab)}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, activeTab, children, className, ...props }, ref) => {
    if (tabId !== activeTab) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${tabId}`}
        aria-labelledby={tabId}
        className={cn('mt-4 focus-visible:outline-none', className)}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';

export { Tabs, TabPanel };
