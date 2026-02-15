"use client";

import { Profile, RevealStatus } from '@/types/api';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

interface RevealedProfileCardProps {
  profile: Partial<Profile>;
  revealStatus: RevealStatus;
  className?: string;
}

export function RevealedProfileCard({ profile, revealStatus, className }: RevealedProfileCardProps) {
  if (!profile || !revealStatus) return null;

  const currentLevel = revealStatus.currentLevel ?? 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="relative bg-gradient-to-br from-primary-100 to-primary-200">
        <div className="flex items-center gap-4">
          {currentLevel >= 3 && profile.avatar ? (
            <Avatar src={profile.avatar} alt={profile.displayName || 'User'} size="lg" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-300 text-2xl">
              {currentLevel >= 1 ? '🎭' : '❓'}
            </div>
          )}
          <div>
            <CardTitle>
              {currentLevel >= 1 ? (profile.displayName || 'Anonymous Player') : 'Mystery Player'}
            </CardTitle>
            {currentLevel >= 2 && profile.age && (
              <p className="text-sm text-neutral-600">Age: {profile.age}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {currentLevel >= 1 && Array.isArray(profile.interests) && profile.interests.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Interests</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest, index) => (
                <Tag key={`${interest}-${index}`}>{interest}</Tag>
              ))}
            </div>
          </div>
        )}

        {currentLevel >= 2 && profile.personality && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Personality</h4>
            <p className="text-sm text-neutral-700">{profile.personality}</p>
          </div>
        )}

        {currentLevel >= 4 && profile.bio && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">About</h4>
            <p className="text-sm text-neutral-700">{profile.bio}</p>
          </div>
        )}

        {currentLevel >= 5 && profile.location && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Location</h4>
            <p className="text-sm text-neutral-700">📍 {profile.location}</p>
          </div>
        )}

        {currentLevel < (revealStatus.maxLevel ?? 5) && (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center">
            <p className="text-sm text-neutral-500">
              🔒 Play more games together to reveal more about this person
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {(revealStatus.maxLevel ?? 5) - currentLevel} more levels to unlock
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
