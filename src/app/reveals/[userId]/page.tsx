"use client";

import { use } from 'react';
import { useRevealStatus } from '@/hooks/use-reveals';
import { useProfile } from '@/hooks/use-profiles';
import { RevealStatusDisplay } from '@/components/features/reveals/RevealStatusDisplay';
import { RevealedProfileCard } from '@/components/features/reveals/RevealedProfileCard';
import { RevealButton } from '@/components/features/reveals/RevealButton';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function RevealPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { data: revealStatus, isLoading: revealLoading, isError: revealError } = useRevealStatus(userId);
  const { data: profile, isLoading: profileLoading } = useProfile(userId);

  const isLoading = revealLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (revealError || !revealStatus) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Alert variant="error">
          Unable to load reveal status. You may not have a match with this user.
        </Alert>
        <div className="mt-4">
          <Link href="/matches">
            <Button variant="secondary">← Back to Matches</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Profile Reveal
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Discover more about this person through gameplay
          </p>
        </div>
        <Link href="/matches">
          <Button variant="secondary" size="sm">← Matches</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {profile && (
            <RevealedProfileCard
              profile={profile}
              revealStatus={revealStatus}
            />
          )}
          <RevealButton
            matchId={revealStatus.matchId ?? ''}
            targetUserId={userId}
            currentLevel={revealStatus.currentLevel ?? 0}
            maxLevel={revealStatus.maxLevel ?? 5}
            className="w-full"
          />
        </div>

        <RevealStatusDisplay revealStatus={revealStatus} />
      </div>
    </div>
  );
}
