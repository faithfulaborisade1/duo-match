'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { RevealStatus, InitiateRevealRequest, RevealResponse } from '@/types/api';

export function useRevealStatus(userId: string) {
  return useQuery({
    queryKey: queryKeys.reveals.status(userId),
    queryFn: () => apiGet<RevealStatus>(`/api/reveals/${userId}`),
    enabled: !!userId,
  });
}

export function useInitiateReveal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitiateRevealRequest) =>
      apiPost<RevealResponse>('/api/reveals', data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        queryKeys.reveals.status(response.reveal.targetUserId),
        response.reveal
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
    },
  });
}
