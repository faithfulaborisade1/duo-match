"use client";

import { LeaderboardPeriod } from '@/types/api';
import { cn } from '@/lib/utils';

interface PeriodFilterProps {
  value: LeaderboardPeriod;
  onChange: (period: LeaderboardPeriod) => void;
  className?: string;
}

const periods: { label: string; value: LeaderboardPeriod }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'All Time', value: 'all_time' },
];

export function PeriodFilter({ value, onChange, className }: PeriodFilterProps) {
  return (
    <div className={cn('inline-flex rounded-lg bg-neutral-100 p-1', className)}>
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
            value === period.value
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
