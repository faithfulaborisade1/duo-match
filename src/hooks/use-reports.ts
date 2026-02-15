'use client';

import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api-client';
import type { SubmitReportRequest, Report } from '@/types/api';

export function useSubmitReport() {
  return useMutation({
    mutationFn: (data: SubmitReportRequest) => apiPost<Report>('/api/reports', data),
  });
}
