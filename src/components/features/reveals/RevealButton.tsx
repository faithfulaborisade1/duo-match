"use client";

import { useState } from 'react';
import { useInitiateReveal } from '@/hooks/use-reveals';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

interface RevealButtonProps {
  matchId: string;
  targetUserId: string;
  currentLevel: number;
  maxLevel: number;
  className?: string;
}

export function RevealButton({ matchId, targetUserId, currentLevel, maxLevel, className }: RevealButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: initiateReveal, isPending } = useInitiateReveal();

  const isMaxLevel = currentLevel >= maxLevel;
  const nextLevel = currentLevel + 1;

  const handleReveal = () => {
    initiateReveal(
      { matchId, targetUserId },
      {
        onSuccess: () => {
          setShowConfirm(false);
        },
      }
    );
  };

  if (isMaxLevel) {
    return (
      <Button variant="secondary" disabled className={className}>
        ✅ Fully Revealed
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowConfirm(true)}
        className={cn(className)}
      >
        🔓 Reveal Level {nextLevel}
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Reveal More of Their Profile?"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            You&apos;re about to unlock <strong>Level {nextLevel}</strong> of this person&apos;s profile.
            This will reveal more information about them, and they&apos;ll be notified that you&apos;re interested in learning more.
          </p>
          <div className="rounded-lg bg-primary-50 p-3">
            <p className="text-sm font-medium text-primary-700">
              💡 Tip: Playing more games together unlocks reveals faster!
            </p>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReveal} disabled={isPending}>
            {isPending ? <><Spinner size="sm" /> Revealing…</> : `Reveal Level ${nextLevel}`}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
