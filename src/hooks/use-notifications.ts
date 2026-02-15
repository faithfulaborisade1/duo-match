'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';
import { apiGet, apiPost, createEventSource } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  Notification,
  NotificationsListParams,
  MarkNotificationsReadRequest,
  PaginatedResponse,
  SuccessResponse,
} from '@/types/api';

export function useNotifications(params?: NotificationsListParams) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Notification>>(
        '/api/notifications',
        params as Record<string, unknown>
      ),
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkNotificationsReadRequest) =>
      apiPost<SuccessResponse>('/api/notifications/read', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useNotificationStream(
  onNotification?: (notification: Notification) => void
) {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        if (onNotificationRef.current) {
          onNotificationRef.current(notification);
        }
      } catch {
        // Ignore malformed events
      }
    },
    [queryClient]
  );

  useEffect(() => {
    const es = createEventSource('/api/notifications/stream');
    eventSourceRef.current = es;

    es.onmessage = handleMessage;
    es.onerror = () => {
      es.close();
      setTimeout(() => {
        if (eventSourceRef.current === es) {
          const newEs = createEventSource('/api/notifications/stream');
          newEs.onmessage = handleMessage;
          eventSourceRef.current = newEs;
        }
      }, 5000);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [handleMessage]);
}
