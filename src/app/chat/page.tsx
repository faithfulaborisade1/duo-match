"use client";

import { useState, useCallback } from 'react';
import { useChatChannels, useChatMessages, useSendMessage } from '@/hooks/use-chat';
import { useCurrentUser } from '@/hooks/use-auth';
import { ChatChannelList } from '@/components/features/chat/ChatChannelList';
import { ChatMessageList } from '@/components/features/chat/ChatMessageList';
import { ChatMessageInput } from '@/components/features/chat/ChatMessageInput';
import { ChatModerationNotice } from '@/components/features/chat/ChatModerationNotice';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ChatPage() {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: channels, isLoading: channelsLoading, isError: channelsError } = useChatChannels();
  const { data: messagesData, isLoading: messagesLoading } = useChatMessages(
    activeChannelId ?? '',
    { enabled: !!activeChannelId }
  );
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const messages = messagesData?.pages?.flatMap((page) => page.data) ?? messagesData ?? [];

  const handleSelectChannel = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
    setMobileShowChat(true);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeChannelId) return;
      sendMessage({ channelId: activeChannelId, content });
    },
    [activeChannelId, sendMessage]
  );

  const handleBackToList = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  const activeChannel = Array.isArray(channels)
    ? channels.find((c) => c.id === activeChannelId)
    : null;

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl">
      {/* Channel List */}
      <div
        className={cn(
          'w-full flex-shrink-0 border-r border-neutral-200 md:w-80',
          mobileShowChat ? 'hidden md:flex md:flex-col' : 'flex flex-col'
        )}
      >
        {channelsLoading && (
          <div className="space-y-3 p-4">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        )}

        {channelsError && (
          <div className="p-4">
            <Alert variant="error">Failed to load conversations.</Alert>
          </div>
        )}

        {!channelsLoading && !channelsError && (
          <ChatChannelList
            channels={Array.isArray(channels) ? channels : []}
            activeChannelId={activeChannelId ?? undefined}
            onSelectChannel={handleSelectChannel}
            className="flex-1"
          />
        )}
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          !mobileShowChat ? 'hidden md:flex' : 'flex'
        )}
      >
        {!activeChannelId && (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title="Select a conversation"
              description="Choose a conversation from the list to start chatting."
            />
          </div>
        )}

        {activeChannelId && (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
              <button
                onClick={handleBackToList}
                className="text-neutral-600 hover:text-neutral-900 md:hidden"
                aria-label="Back to conversations"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {activeChannel && (
                <>
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {activeChannel.participant?.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    {activeChannel.participant?.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {activeChannel.participant?.displayName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {activeChannel.participant?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <Link href={`/reveals/${activeChannel.participant?.id}`}>
                    <Button variant="secondary" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <ChatModerationNotice />

            <ChatMessageList
              messages={Array.isArray(messages) ? messages : []}
              currentUserId={currentUser?.id ?? ''}
              isLoading={messagesLoading}
              className="flex-1"
            />

            <ChatMessageInput
              onSend={handleSendMessage}
              isSending={isSending}
            />
          </>
        )}
      </div>
    </div>
  );
}
