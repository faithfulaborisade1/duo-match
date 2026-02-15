'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  Profile,
  ProfileListItem,
  UpdateProfileRequest,
  ProfilesListParams,
  PaginatedResponse,
} from '@/types/api';

export function useProfiles(params?: ProfilesListParams) {
  return useQuery({
    queryKey: queryKeys.profiles.list(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<ProfileListItem>>('/api/profiles', params as Record<string, unknown>),
  });
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(id),
    queryFn: () => apiGet<ProfileListItem>(`/api/profiles/${id}`),
    enabled: !!id,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.profiles.me,
    queryFn: () => apiGet<Profile>('/api/profiles/me'),
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => apiPatch<Profile>('/api/profiles/me', data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.profiles.me, updatedProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
