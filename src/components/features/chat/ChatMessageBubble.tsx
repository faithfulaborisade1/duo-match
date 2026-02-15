"use client";

import { ChatMessage } from '@/types/api';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn, formatRelativeTime } from '@/lib/utils';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  className?: string;
}

export function ChatMessageBubble({ message, isOwn, showAvatar = true, className }: ChatMessageBubbleProps) {
  if (!message) return null;

  const isModerated = message.moderationStatus === 'flagged' || message.moderationStatus === 'blocked';
  const isBlocked = message.moderationStatus === 'blocked';

  return (
    <div
      className={cn(
        'flex gap-2',
        isOwn ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {showAvatar && !isOwn && (
        <Avatar
          src={message.sender?.avatar}
          alt={message.sender?.displayName || 'User'}
          size="sm"
          className="mt-1 flex-shrink-0"
        />
      )}
      {!showAvatar && !isOwn && <div className="w-8 flex-shrink-0" />}

      <div className={cn('max-w-[75%] space-y-1', isOwn && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isOwn
              ? 'rounded-br-md bg-primary-500 text-white'
              : 'rounded-bl-md bg-neutral-100 text-neutral-900',
            isBlocked && 'bg-red-50 text-red-400 line-through',
            isModerated && !isBlocked && 'border border-yellow-300 bg-yellow-50'
          )}
        >
          {isBlocked ? (
            <p className="text-sm italic">This message was removed by moderation</p>
          ) : isModerated ? (
            <div>
              <p className="text-sm text-neutral-700">{message.content}</p>
              <Tooltip content="This message was flagged by AI moderation for review">
                <Badge variant="warning" size="sm" className="mt-1">
                  ⚠️ Flagged
                </Badge>
              </Tooltip>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        <p className={cn(
          'text-xs text-neutral-400',
          isOwn ? 'text-right' : 'text-left'
        )}>
          {formatRelativeTime(message.createdAt)}
          {isOwn && message.readAt && (
            <span className="ml-1">✓✓</span>
          )}
        </p>
      </div>
    </div>
  );
}
