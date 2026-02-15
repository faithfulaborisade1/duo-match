'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  LeaderboardEntry,
  LeaderboardParams,
  LeaderboardMyStats,
  CursorPaginatedResponse,
} from '@/types/api';

export function useLeaderboard(params?: LeaderboardParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.leaderboard.list(params as Record<string, unknown>),
    queryFn: ({ pageParam }) =>
      apiGet<CursorPaginatedResponse<LeaderboardEntry>>('/api/leaderboard', {
        period: params?.period,
        cursor: pageParam,
        limit: params?.limit || 20,
      }),
    initialPageParam: params?.cursor || undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.cursor : undefined,
  });
}

export function useLeaderboardMyStats() {
  return useQuery({
    queryKey: queryKeys.leaderboard.me,
    queryFn: () => apiGet<LeaderboardMyStats>('/api/leaderboard/me'),
  });
}
