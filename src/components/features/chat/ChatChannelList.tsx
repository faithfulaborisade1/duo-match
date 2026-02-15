"use client";

import { ChatChannel } from '@/types/api';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn, formatRelativeTime, truncate } from '@/lib/utils';

interface ChatChannelListProps {
  channels: ChatChannel[];
  activeChannelId?: string;
  onSelectChannel: (channelId: string) => void;
  className?: string;
}

export function ChatChannelList({ channels, activeChannelId, onSelectChannel, className }: ChatChannelListProps) {
  if (!Array.isArray(channels)) return null;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-lg font-bold text-neutral-900">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {channels.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-neutral-500">No conversations yet</p>
            <p className="mt-1 text-xs text-neutral-400">Match with someone and start playing!</p>
          </div>
        )}
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className={cn(
              'flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors hover:bg-neutral-50',
              activeChannelId === channel.id && 'bg-primary-50 hover:bg-primary-50'
            )}
          >
            <div className="relative">
              <Avatar
                src={channel.participant?.avatar}
                alt={channel.participant?.displayName || 'User'}
                size="md"
              />
              {channel.participant?.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {channel.participant?.displayName || 'Unknown User'}
                </p>
                {channel.lastMessageAt && (
                  <span className="ml-2 flex-shrink-0 text-xs text-neutral-400">
                    {formatRelativeTime(channel.lastMessageAt)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="truncate text-xs text-neutral-500">
                  {channel.lastMessage ? truncate(channel.lastMessage, 40) : 'No messages yet'}
                </p>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
