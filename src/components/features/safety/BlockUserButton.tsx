"use client";

import { useState } from 'react';
import { useSubmitReport } from '@/hooks/use-reports';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

interface BlockUserButtonProps {
  userId: string;
  userName?: string;
  className?: string;
}

export function BlockUserButton({ userId, userName, className }: BlockUserButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const { mutate: submitReport, isPending } = useSubmitReport();

  const handleBlock = () => {
    submitReport(
      {
        targetType: 'user',
        targetId: userId,
        reason: 'other',
        description: 'User blocked by action',
      },
      {
        onSuccess: () => {
          setBlocked(true);
          setShowConfirm(false);
        },
      }
    );
  };

  if (blocked) {
    return (
      <Button variant="secondary" disabled className={cn(className)}>
        ✓ Blocked
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setShowConfirm(true)}
        className={cn('text-red-600 hover:bg-red-50 hover:text-red-700', className)}
      >
        Block User
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Block User"
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-600">
            Are you sure you want to block <strong>{userName || 'this user'}</strong>?
          </p>
          <ul className="space-y-1 text-sm text-neutral-500">
            <li>• They won&apos;t be able to message you</li>
            <li>• They won&apos;t appear in your matches</li>
            <li>• They won&apos;t be able to see your profile</li>
            <li>• You can unblock them later from settings</li>
          </ul>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBlock}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? <><Spinner size="sm" /> Blocking…</> : 'Block User'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
