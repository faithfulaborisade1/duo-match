"use client";

import { LeaderboardEntry } from '@/types/api';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
  className?: string;
}

const podiumConfig = [
  { position: 1, order: 'order-2', height: 'h-32', bg: 'bg-yellow-50 border-yellow-300', medal: '🥇', ring: 'ring-yellow-400' },
  { position: 0, order: 'order-1', height: 'h-24', bg: 'bg-gray-50 border-gray-300', medal: '🥈', ring: 'ring-gray-400' },
  { position: 2, order: 'order-3', height: 'h-20', bg: 'bg-amber-50 border-amber-300', medal: '🥉', ring: 'ring-amber-400' },
];

export function LeaderboardPodium({ entries, className }: LeaderboardPodiumProps) {
  if (!Array.isArray(entries) || entries.length < 3) return null;

  return (
    <div className={cn('flex items-end justify-center gap-3 px-4 pb-2 pt-8', className)}>
      {podiumConfig.map((config) => {
        const entry = entries[config.position];
        if (!entry) return null;

        return (
          <div
            key={entry.userId}
            className={cn('flex flex-col items-center', config.order)}
          >
            <div className="relative mb-2">
              <Avatar
                src={entry.avatar}
                alt={entry.displayName}
                size={config.position === 0 ? 'lg' : 'md'}
                className={cn('ring-2', config.ring)}
              />
              <span className="absolute -bottom-1 -right-1 text-lg">{config.medal}</span>
            </div>
            <Link
              href={`/profiles/${entry.userId}`}
              className="mb-1 max-w-[100px] truncate text-center text-sm font-semibold text-neutral-900 hover:text-primary-600"
            >
              {entry.displayName}
            </Link>
            <span className="mb-2 text-xs font-bold text-primary-600">
              {formatNumber(entry.score)} pts
            </span>
            <div
              className={cn(
                'flex w-20 items-center justify-center rounded-t-lg border-2 sm:w-24',
                config.height,
                config.bg
              )}
            >
              <span className="text-2xl font-black text-neutral-700">#{entry.rank}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
