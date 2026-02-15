'use client';

import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api-client';
import type { ContactRequest, SuccessResponse } from '@/types/api';

export function useContact() {
  return useMutation({
    mutationFn: (data: ContactRequest) =>
      apiPost<SuccessResponse>('/api/contact', data),
  });
}
