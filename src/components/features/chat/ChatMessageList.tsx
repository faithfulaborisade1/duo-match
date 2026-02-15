"use client";

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/api';
import { ChatMessageBubble } from '@/components/features/chat/ChatMessageBubble';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
  className?: string;
}

export function ChatMessageList({ messages, currentUserId, isLoading, className }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-1 flex-col overflow-y-auto px-4 py-4', className)}
    >
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="md" />
        </div>
      )}

      {!isLoading && (!Array.isArray(messages) || messages.length === 0) && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="mb-2 text-4xl">👋</span>
          <p className="text-sm font-medium text-neutral-600">Start the conversation!</p>
          <p className="mt-1 text-xs text-neutral-400">
            Say hello and get to know each other through play.
          </p>
        </div>
      )}

      {!isLoading && Array.isArray(messages) && messages.length > 0 && (
        <div className="space-y-1">
          {messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

            return (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
              />
            );
          })}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
