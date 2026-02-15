"use client";

import { LeaderboardMyStats } from '@/types/api';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MyStatsCardProps {
  stats: LeaderboardMyStats;
  className?: string;
}

export function MyStatsCard({ stats, className }: MyStatsCardProps) {
  if (!stats) return null;

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <CardTitle className="text-white">Your Stats</CardTitle>
      </CardHeader>
      <CardBody className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Current Rank</p>
            <p className="text-3xl font-black text-neutral-900">#{stats.rank}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Total Score</p>
            <p className="text-3xl font-black text-primary-600">{formatNumber(stats.score)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-neutral-50 p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">{formatNumber(stats.gamesPlayed)}</p>
            <p className="text-xs text-neutral-500">Games</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-lg font-bold text-green-700">{formatNumber(stats.wins)}</p>
            <p className="text-xs text-neutral-500">Wins</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-lg font-bold text-red-700">{formatNumber(stats.losses)}</p>
            <p className="text-xs text-neutral-500">Losses</p>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Win Rate</span>
            <span className="text-sm font-bold text-neutral-900">{winRate}%</span>
          </div>
          <ProgressBar
            value={winRate}
            max={100}
            variant={winRate >= 60 ? 'success' : winRate >= 40 ? 'primary' : 'warning'}
            size="md"
          />
        </div>

        {stats.streak > 0 && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-orange-50 p-3">
            <span className="text-xl">🔥</span>
            <span className="text-sm font-bold text-orange-700">
              {stats.streak} game win streak!
            </span>
          </div>
        )}

        {stats.percentile !== undefined && (
          <div className="text-center">
            <Badge variant="primary" size="md">
              Top {stats.percentile}% of players
            </Badge>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
