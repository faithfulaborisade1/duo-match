"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import type { Game } from "@/types/api";

interface GameCardProps {
  game: Game;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  strategy: "bg-primary-100 text-primary-700",
  puzzle: "bg-secondary-100 text-secondary-700",
  word: "bg-warning-100 text-warning-700",
  trivia: "bg-success-100 text-success-700",
  card: "bg-error-100 text-error-700",
};

const CATEGORY_ICONS: Record<string, string> = {
  strategy: "♟️",
  puzzle: "🧩",
  word: "📝",
  trivia: "🧠",
  card: "🃏",
};

export function GameCard({ game, className }: GameCardProps) {
  if (!game) return null;

  const categoryColor = CATEGORY_COLORS[game.category] || "bg-neutral-100 text-neutral-700";
  const categoryIcon = CATEGORY_ICONS[game.category] || "🎮";

  return (
    <Link href={`/games/${game.slug}`}>
      <Card className={cn("group hover:shadow-md transition-all cursor-pointer h-full", className)}>
        <div className="relative overflow-hidden rounded-t-xl">
          <div className={cn("h-40 flex items-center justify-center", categoryColor)}>
            <span className="text-6xl group-hover:scale-110 transition-transform">{categoryIcon}</span>
          </div>
          {game.isNew && (
            <div className="absolute top-3 right-3">
              <Badge variant="primary" size="sm">New</Badge>
            </div>
          )}
        </div>
        <CardBody className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
              {game.name}
            </h3>
            <Badge variant="secondary" size="sm">
              {game.category}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
            {game.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {game.duration || "5-10 min"}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              2 players
            </span>
            {typeof game.playCount === "number" && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {game.playCount.toLocaleString()} plays
              </span>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
