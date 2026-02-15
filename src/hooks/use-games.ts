'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Game, GamesListParams } from '@/types/api';

export function useGames(params?: GamesListParams) {
  return useQuery({
    queryKey: queryKeys.games.list(params as Record<string, unknown>),
    queryFn: () => apiGet<Game[]>('/api/games', params as Record<string, unknown>),
  });
}

export function useGame(slug: string) {
  return useQuery({
    queryKey: queryKeys.games.detail(slug),
    queryFn: () => apiGet<Game>(`/api/games/${slug}`),
    enabled: !!slug,
  });
}
