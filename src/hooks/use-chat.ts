'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  ChatChannel,
  ChatMessage,
  SendMessageRequest,
  MessagesListParams,
  CursorPaginatedResponse,
} from '@/types/api';

export function useChatChannels() {
  return useQuery({
    queryKey: queryKeys.chat.channels,
    queryFn: () => apiGet<ChatChannel[]>('/api/chat/channels'),
  });
}

export function useChatMessages(channelId: string, params?: MessagesListParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(channelId, params as Record<string, unknown>),
    queryFn: ({ pageParam }) =>
      apiGet<CursorPaginatedResponse<ChatMessage>>(
        `/api/chat/channels/${channelId}/messages`,
        {
          cursor: pageParam,
          limit: params?.limit || 50,
        }
      ),
    initialPageParam: params?.cursor || undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.cursor : undefined,
    enabled: !!channelId,
  });
}

export function useSendMessage(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) =>
      apiPost<ChatMessage>(`/api/chat/channels/${channelId}/messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(channelId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.channels });
    },
  });
}
