"use client";

import { useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';

interface ChatMessageInputProps {
  onSend: (content: string) => void;
  isSending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatMessageInput({
  onSend,
  isSending = false,
  disabled = false,
  placeholder = 'Type a message…',
  className,
}: ChatMessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed || isSending || disabled) return;
    onSend(trimmed);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [content, isSending, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  return (
    <div className={cn('flex items-end gap-2 border-t border-neutral-200 bg-white px-4 py-3', className)}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="max-h-[120px] min-h-[40px] flex-1 resize-none rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!content.trim() || isSending || disabled}
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors',
          content.trim() && !isSending && !disabled
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'bg-neutral-200 text-neutral-400'
        )}
        aria-label="Send message"
      >
        {isSending ? (
          <Spinner size="sm" />
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        )}
      </button>
    </div>
  );
}
