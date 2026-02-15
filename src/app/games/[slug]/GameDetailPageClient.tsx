"use client";

import { GameDetail } from "@/components/features/games/GameDetail";

interface GameDetailPageClientProps {
  slug: string;
}

export function GameDetailPageClient({ slug }: GameDetailPageClientProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <GameDetail slug={slug} />
      </div>
    </div>
  );
}
