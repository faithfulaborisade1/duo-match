"use client";

import { Achievement } from '@/types/api';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface AchievementGridProps {
  achievements: Achievement[];
  className?: string;
}

export function AchievementGrid({ achievements, className }: AchievementGridProps) {
  if (!Array.isArray(achievements) || achievements.length === 0) return null;

  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  return (
    <div className={cn('space-y-6', className)}>
      {unlocked.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Unlocked ({unlocked.length})
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {unlocked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Locked ({locked.length})
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {locked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const isUnlocked = !!achievement.unlockedAt;

  return (
    <Tooltip content={achievement.description}>
      <Card
        className={cn(
          'transition-all duration-200',
          isUnlocked
            ? 'border-primary-200 bg-primary-50 shadow-sm hover:shadow-md'
            : 'border-neutral-200 bg-neutral-50 opacity-60 grayscale'
        )}
      >
        <CardBody className="flex flex-col items-center p-4 text-center">
          <span className="mb-2 text-3xl">{achievement.icon || '🏆'}</span>
          <p className="mb-1 text-xs font-semibold text-neutral-900">{achievement.name}</p>
          {isUnlocked && achievement.unlockedAt ? (
            <Badge variant="success" size="sm">
              {formatDate(achievement.unlockedAt)}
            </Badge>
          ) : (
            <Badge variant="default" size="sm">
              Locked
            </Badge>
          )}
          {achievement.points !== undefined && (
            <p className="mt-1 text-xs text-neutral-500">{achievement.points} pts</p>
          )}
        </CardBody>
      </Card>
    </Tooltip>
  );
}
