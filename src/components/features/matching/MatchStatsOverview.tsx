"use client";

import { cn } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { MatchStats } from "@/types/api";

interface MatchStatsOverviewProps {
  stats: MatchStats | undefined;
  isLoading?: boolean;
  className?: string;
}

export function MatchStatsOverview({ stats, isLoading, className }: MatchStatsOverviewProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardBody className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    { label: "Total Matches", value: stats.totalMatches ?? 0, icon: "🎯", color: "bg-primary-50 text-primary-700" },
    { label: "Active Matches", value: stats.activeMatches ?? 0, icon: "💬", color: "bg-success-50 text-success-700" },
    { label: "Games Played", value: stats.gamesPlayed ?? 0, icon: "🎮", color: "bg-secondary-50 text-secondary-700" },
    { label: "Avg Score", value: stats.averageScore ? `${Math.round(stats.averageScore * 100)}%` : "—", icon: "⭐", color: "bg-warning-50 text-warning-700" },
  ];

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4", className)}>
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm", item.color)}>
                {item.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{item.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{item.label}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
