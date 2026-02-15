'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  AdminUser,
  AdminUsersListParams,
  ModerationItem,
  ModerationQueueParams,
  ModerationActionRequest,
  Appeal,
  AppealDecisionRequest,
  AppealsListParams,
  Analytics,
  AnalyticsParams,
  PaginatedResponse,
  SuccessResponse,
} from '@/types/api';

export function useAdminUsers(params?: AdminUsersListParams) {
  return useQuery({
    queryKey: queryKeys.admin.users(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<AdminUser>>(
        '/api/admin/users',
        params as Record<string, unknown>
      ),
  });
}

export function useModerationQueue(params?: ModerationQueueParams) {
  return useQuery({
    queryKey: queryKeys.admin.moderationQueue(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<ModerationItem>>(
        '/api/admin/moderation/queue',
        params as Record<string, unknown>
      ),
  });
}

export function useModerationAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModerationActionRequest) =>
      apiPost<SuccessResponse>('/api/admin/moderation/actions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'moderation', 'queue'],
      });
    },
  });
}

export function useAppeals(params?: AppealsListParams) {
  return useQuery({
    queryKey: queryKeys.admin.appeals(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Appeal>>(
        '/api/admin/moderation/appeals',
        params as Record<string, unknown>
      ),
  });
}

export function useAppealDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppealDecisionRequest }) =>
      apiPatch<Appeal>(`/api/admin/moderation/appeals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'moderation', 'appeals'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'moderation', 'queue'],
      });
    },
  });
}

export function useAdminAnalytics(params?: AnalyticsParams) {
  return useQuery({
    queryKey: queryKeys.admin.analytics(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<Analytics>('/api/admin/analytics', params as Record<string, unknown>),
  });
}
