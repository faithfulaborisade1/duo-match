'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { OnboardingProgress, CompleteStepRequest } from '@/types/api';

export function useOnboardingProgress() {
  return useQuery({
    queryKey: queryKeys.onboarding.progress,
    queryFn: () => apiGet<OnboardingProgress>('/api/onboarding'),
  });
}

export function useCompleteOnboardingStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteStepRequest) =>
      apiPost<OnboardingProgress>('/api/onboarding/complete-step', data),
    onSuccess: (updatedProgress) => {
      queryClient.setQueryData(queryKeys.onboarding.progress, updatedProgress);
    },
  });
}
