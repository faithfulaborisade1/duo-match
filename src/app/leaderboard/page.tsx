"use client";

import { useState, useCallback } from 'react';
import { useLeaderboard, useLeaderboardMyStats } from '@/hooks/use-leaderboard';
import { useAchievements } from '@/hooks/use-achievements';
import { useCurrentUser } from '@/hooks/use-auth';
import { LeaderboardPeriod } from '@/types/api';
import { LeaderboardTable } from '@/components/features/leaderboard/LeaderboardTable';
import { LeaderboardPodium } from '@/components/features/leaderboard/LeaderboardPodium';
import { MyStatsCard } from '@/components/features/leaderboard/MyStatsCard';
import { AchievementGrid } from '@/components/features/leaderboard/AchievementGrid';
import { PeriodFilter } from '@/components/features/leaderboard/PeriodFilter';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

const tabs = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'achievements', label: 'Achievements' },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [activeTab, setActiveTab] = useState('leaderboard');

  const { data: currentUser } = useCurrentUser();
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    isError: leaderboardError,
    refetch: refetchLeaderboard,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLeaderboard({ period, limit: 50 });
  const { data: myStats, isLoading: statsLoading } = useLeaderboardMyStats();
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();

  const handlePeriodChange = useCallback((newPeriod: LeaderboardPeriod) => {
    setPeriod(newPeriod);
  }, []);

  const allEntries = leaderboardData?.pages?.flatMap((page) => page.data) ?? [];
  const topThree = allEntries.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">Leaderboard & Stats</h1>
        <p className="mt-1 text-neutral-500">
          See how you rank against other players and track your achievements.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <TabPanel tabId="leaderboard" activeTab={activeTab}>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <PeriodFilter value={period} onChange={handlePeriodChange} />
            </div>

            {leaderboardError && (
              <Alert variant="error">
                Failed to load leaderboard data.
                <button
                  onClick={() => refetchLeaderboard()}
                  className="ml-2 font-semibold underline"
                >
                  Retry
                </button>
              </Alert>
            )}

            {leaderboardLoading && (
              <div className="space-y-4">
                <div className="flex items-end justify-center gap-3 py-8">
                  <Skeleton className="h-24 w-20 rounded-t-lg" />
                  <Skeleton className="h-32 w-20 rounded-t-lg" />
                  <Skeleton className="h-20 w-20 rounded-t-lg" />
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            )}

            {!leaderboardLoading && !leaderboardError && allEntries.length === 0 && (
              <EmptyState
                title="No leaderboard data yet"
                description="Play some games to start climbing the ranks!"
              />
            )}

            {!leaderboardLoading && !leaderboardError && allEntries.length > 0 && (
              <>
                {topThree.length >= 3 && <LeaderboardPodium entries={topThree} />}
                <LeaderboardTable
                  entries={allEntries}
                  currentUserId={currentUser?.id}
                />
                {hasNextPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Spinner size="sm" /> Loading more…
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            {statsLoading && (
              <div className="space-y-3">
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            )}
            {myStats && <MyStatsCard stats={myStats} />}
          </div>
        </div>
      </TabPanel>

      <TabPanel tabId="achievements" activeTab={activeTab}>
        <div className="mt-6">
          {achievementsLoading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!achievementsLoading && (!achievements || achievements.length === 0) && (
            <EmptyState
              title="No achievements available"
              description="Achievements will appear here as they become available."
            />
          )}

          {!achievementsLoading && Array.isArray(achievements) && achievements.length > 0 && (
            <AchievementGrid achievements={achievements} />
          )}
        </div>
      </TabPanel>
    </div>
  );
}
