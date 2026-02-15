'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  GameSession,
  CreateGameSessionRequest,
  UpdateGameSessionRequest,
  EndGameSessionResponse,
  GameSessionHistoryParams,
  PaginatedResponse,
} from '@/types/api';

export function useGameSession(id: string) {
  return useQuery({
    queryKey: queryKeys.gameSessions.detail(id),
    queryFn: () => apiGet<GameSession>(`/api/game-sessions/${id}`),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data as GameSession | undefined;
      if (data && (data.status === 'active' || data.status === 'waiting')) {
        return 2000;
      }
      return false;
    },
  });
}

export function useGameSessionHistory(params?: GameSessionHistoryParams) {
  return useQuery({
    queryKey: queryKeys.gameSessions.history(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<GameSession>>(
        '/api/game-sessions/history',
        params as Record<string, unknown>
      ),
  });
}

export function useCreateGameSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGameSessionRequest) =>
      apiPost<GameSession>('/api/game-sessions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gameSessions.all });
    },
  });
}

export function useUpdateGameSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGameSessionRequest }) =>
      apiPatch<GameSession>(`/api/game-sessions/${id}`, data),
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(
        queryKeys.gameSessions.detail(updatedSession.id),
        updatedSession
      );
    },
  });
}

export function useEndGameSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiPost<EndGameSessionResponse>(`/api/game-sessions/${id}/end`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gameSessions.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.gameSessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.stats });
    },
  });
}
