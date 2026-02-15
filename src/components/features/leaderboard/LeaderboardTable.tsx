"use client";

import { LeaderboardEntry } from '@/types/api';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

function getRankDisplay(rank: number) {
  if (rank === 1) return { icon: '🥇', color: 'text-yellow-500' };
  if (rank === 2) return { icon: '🥈', color: 'text-gray-400' };
  if (rank === 3) return { icon: '🥉', color: 'text-amber-600' };
  return { icon: null, color: 'text-neutral-400' };
}

export function LeaderboardTable({ entries, currentUserId, className }: LeaderboardTableProps) {
  if (!Array.isArray(entries) || entries.length === 0) return null;

  return (
    <div className={cn('overflow-hidden rounded-xl border border-neutral-200 bg-white', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Player</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Score</th>
            <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Games</th>
            <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 md:table-cell">Win Rate</th>
            <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 lg:table-cell">Streak</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {entries.map((entry) => {
            const rankInfo = getRankDisplay(entry.rank);
            const isCurrentUser = currentUserId === entry.userId;

            return (
              <tr
                key={entry.userId}
                className={cn(
                  'transition-colors hover:bg-neutral-50',
                  isCurrentUser && 'bg-primary-50 hover:bg-primary-100'
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {rankInfo.icon ? (
                      <span className="text-lg">{rankInfo.icon}</span>
                    ) : (
                      <span className={cn('text-sm font-bold', rankInfo.color)}>#{entry.rank}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={entry.avatar}
                      alt={entry.displayName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/profiles/${entry.userId}`}
                        className="block truncate text-sm font-semibold text-neutral-900 hover:text-primary-600"
                      >
                        {entry.displayName}
                      </Link>
                      {isCurrentUser && (
                        <Badge variant="primary" size="sm">You</Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-neutral-900">
                    {formatNumber(entry.score)}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  <span className="text-sm text-neutral-600">
                    {formatNumber(entry.gamesPlayed)}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-right md:table-cell">
                  <span className="text-sm text-neutral-600">
                    {entry.gamesPlayed > 0
                      ? `${Math.round((entry.wins / entry.gamesPlayed) * 100)}%`
                      : '—'}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-right lg:table-cell">
                  {entry.streak > 0 ? (
                    <Badge variant="success" size="sm">
                      🔥 {entry.streak}
                    </Badge>
                  ) : (
                    <span className="text-sm text-neutral-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
