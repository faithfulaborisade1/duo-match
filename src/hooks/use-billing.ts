'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  BillingPlan,
  Subscription,
  CheckoutRequest,
  CheckoutResponse,
  PortalRequest,
  PortalResponse,
} from '@/types/api';

export function useBillingPlans() {
  return useQuery({
    queryKey: queryKeys.billing.plans,
    queryFn: () => apiGet<BillingPlan[]>('/api/billing/plans'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.billing.subscription,
    queryFn: () => apiGet<Subscription>('/api/billing/subscription'),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (data: CheckoutRequest) =>
      apiPost<CheckoutResponse>('/api/billing/checkout', data),
    onSuccess: (response) => {
      if (response.url) {
        window.location.href = response.url;
      }
    },
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: (data?: PortalRequest) =>
      apiPost<PortalResponse>('/api/billing/portal', data),
    onSuccess: (response) => {
      if (response.url) {
        window.location.href = response.url;
      }
    },
  });
}
