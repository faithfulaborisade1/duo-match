"use client";

import { useState } from 'react';
import { ReportTargetType } from '@/types/api';
import { Modal } from '@/components/ui/Modal';
import { IconButton } from '@/components/ui/IconButton';
import { ReportForm } from '@/components/features/safety/ReportForm';
import { cn } from '@/lib/utils';

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: string;
  className?: string;
}

export function ReportButton({ targetType, targetId, className }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn('text-neutral-400 hover:text-red-500', className)}
        aria-label="Report"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </IconButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title=""
      >
        <ReportForm
          targetType={targetType}
          targetId={targetId}
          onSuccess={() => {
            setTimeout(() => setIsOpen(false), 2000);
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
