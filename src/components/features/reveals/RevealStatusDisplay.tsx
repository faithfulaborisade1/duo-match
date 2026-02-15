"use client";

import { RevealStatus } from '@/types/api';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface RevealStatusDisplayProps {
  revealStatus: RevealStatus;
  className?: string;
}

const revealLevels = [
  { level: 1, label: 'Interests', icon: '💡', description: 'Shared interests and hobbies' },
  { level: 2, label: 'Personality', icon: '🎭', description: 'Personality traits and values' },
  { level: 3, label: 'Photos', icon: '📸', description: 'Profile photos revealed' },
  { level: 4, label: 'Bio', icon: '📝', description: 'Full bio and background' },
  { level: 5, label: 'Full Profile', icon: '⭐', description: 'Complete profile access' },
];

export function RevealStatusDisplay({ revealStatus, className }: RevealStatusDisplayProps) {
  if (!revealStatus) return null;

  const currentLevel = revealStatus.currentLevel ?? 0;
  const maxLevel = revealStatus.maxLevel ?? 5;
  const progressPercent = maxLevel > 0 ? Math.round((currentLevel / maxLevel) * 100) : 0;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Profile Reveal Progress</h3>
          <p className="text-xs text-neutral-500">Level {currentLevel} of {maxLevel}</p>
        </div>
        <Badge variant={currentLevel >= maxLevel ? 'success' : 'primary'} size="md">
          {currentLevel >= maxLevel ? 'Fully Revealed' : `${progressPercent}%`}
        </Badge>
      </div>

      <ProgressBar
        value={currentLevel}
        max={maxLevel}
        variant={currentLevel >= maxLevel ? 'success' : 'primary'}
        size="lg"
      />

      <div className="space-y-2">
        {revealLevels.map((level) => {
          const isUnlocked = currentLevel >= level.level;
          const isCurrent = currentLevel === level.level - 1;

          return (
            <div
              key={level.level}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 transition-all',
                isUnlocked
                  ? 'border-primary-200 bg-primary-50'
                  : isCurrent
                    ? 'border-primary-300 bg-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 opacity-50'
              )}
            >
              <span className={cn('text-xl', !isUnlocked && 'grayscale')}>
                {isUnlocked ? level.icon : '🔒'}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn(
                  'text-sm font-medium',
                  isUnlocked ? 'text-primary-700' : 'text-neutral-600'
                )}>
                  {level.label}
                </p>
                <p className="text-xs text-neutral-500">{level.description}</p>
              </div>
              {isUnlocked && (
                <svg className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
