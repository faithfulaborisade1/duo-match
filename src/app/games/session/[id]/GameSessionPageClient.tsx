"use client";

import { GameSessionView } from "@/components/features/game-session/GameSessionView";

interface GameSessionPageClientProps {
  sessionId: string;
}

export function GameSessionPageClient({ sessionId }: GameSessionPageClientProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <GameSessionView sessionId={sessionId} />
      </div>
    </div>
  );
}
