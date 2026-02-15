'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';
import { apiGet, apiPatch, createEventSource } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  Match,
  MatchDetail,
  MatchesListParams,
  UpdateMatchRequest,
  MatchStats,
  MatchEvent,
  PaginatedResponse,
} from '@/types/api';

export function useMatches(params?: MatchesListParams) {
  return useQuery({
    queryKey: queryKeys.matches.list(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Match>>('/api/matches', params as Record<string, unknown>),
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: queryKeys.matches.detail(id),
    queryFn: () => apiGet<MatchDetail>(`/api/matches/${id}`),
    enabled: !!id,
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMatchRequest }) =>
      apiPatch<Match>(`/api/matches/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.stats });
    },
  });
}

export function useMatchStats() {
  return useQuery({
    queryKey: queryKeys.matches.stats,
    queryFn: () => apiGet<MatchStats>('/api/matches/stats'),
  });
}

export function useMatchEvents(onEvent?: (event: MatchEvent) => void) {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const handleEvent = useCallback(
    (event: MessageEvent) => {
      try {
        const matchEvent: MatchEvent = JSON.parse(event.data);
        queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.matches.stats });
        if (onEventRef.current) {
          onEventRef.current(matchEvent);
        }
      } catch {
        // Ignore malformed events
      }
    },
    [queryClient]
  );

  useEffect(() => {
    const es = createEventSource('/api/matches/events');
    eventSourceRef.current = es;

    es.onmessage = handleEvent;
    es.onerror = () => {
      es.close();
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (eventSourceRef.current === es) {
          const newEs = createEventSource('/api/matches/events');
          newEs.onmessage = handleEvent;
          eventSourceRef.current = newEs;
        }
      }, 5000);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [handleEvent]);
}
