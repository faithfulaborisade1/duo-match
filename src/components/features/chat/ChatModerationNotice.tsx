"use client";

import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

interface ChatModerationNoticeProps {
  className?: string;
}

export function ChatModerationNotice({ className }: ChatModerationNoticeProps) {
  return (
    <div className={cn('px-4 py-2', className)}>
      <Alert variant="info">
        <div className="flex items-center gap-2">
          <span className="text-base">🤖</span>
          <p className="text-xs">
            Messages are reviewed by AI to keep conversations safe and respectful.
            Flagged messages are reviewed by our moderation team.
          </p>
        </div>
      </Alert>
    </div>
  );
}
