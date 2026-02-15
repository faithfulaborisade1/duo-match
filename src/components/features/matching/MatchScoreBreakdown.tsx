"use client";

import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ScoreCategory {
  label: string;
  value: number;
  icon: string;
}

interface MatchScoreBreakdownProps {
  breakdown: Record<string, number>;
  totalScore: number;
  className?: string;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  interests: { label: "Shared Interests", icon: "🎯" },
  gameStyle: { label: "Play Style", icon: "🎮" },
  activity: { label: "Activity Level", icon: "⚡" },
  personality: { label: "Personality", icon: "🧩" },
  goals: { label: "Connection Goals", icon: "🤝" },
};

export function MatchScoreBreakdown({ breakdown, totalScore, className }: MatchScoreBreakdownProps) {
  if (!breakdown) return null;

  const categories: ScoreCategory[] = Object.entries(breakdown).map(([key, value]) => ({
    label: CATEGORY_META[key]?.label || key,
    value: Math.round((value as number) * 100),
    icon: CATEGORY_META[key]?.icon || "📊",
  }));

  const totalPercent = Math.round(totalScore * 100);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100">
          <span className="text-2xl font-bold text-primary-700">{totalPercent}%</span>
        </div>
        <p className="text-sm text-neutral-600 mt-2">Overall match score</p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="font-medium text-neutral-700">{category.label}</span>
              </span>
              <span className="font-semibold text-neutral-900">{category.value}%</span>
            </div>
            <ProgressBar
              value={category.value}
              variant={category.value >= 80 ? "success" : category.value >= 50 ? "primary" : "warning"}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
