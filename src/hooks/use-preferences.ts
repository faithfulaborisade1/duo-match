'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { MatchPreferences, UpdatePreferencesRequest } from '@/types/api';

export function usePreferences() {
  return useQuery({
    queryKey: queryKeys.preferences.all,
    queryFn: () => apiGet<MatchPreferences>('/api/preferences'),
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) =>
      apiPut<MatchPreferences>('/api/preferences', data),
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(queryKeys.preferences.all, updatedPreferences);
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
    },
  });
}
