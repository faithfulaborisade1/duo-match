'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Achievement } from '@/types/api';

export function useAchievements() {
  return useQuery({
    queryKey: queryKeys.achievements.all,
    queryFn: () => apiGet<Achievement[]>('/api/achievements'),
  });
}
