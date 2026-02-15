"use client";

import { useRouter } from "next/navigation";
import { GameLibraryGrid } from "@/components/features/games/GameLibraryGrid";
import { GameSessionHistory } from "@/components/features/game-session/GameSessionHistory";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { useState } from "react";

export function GamesPageClient() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Game Library 🎮</h1>
          <p className="text-neutral-600 mt-1">
            Choose a game to play with your matches. Each game is designed for two players to connect through play.
          </p>
        </div>

        <Tabs
          tabs={[
            { label: "All Games", id: "all" },
            { label: "Recent Sessions", id: "history" },
          ]}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 0 && <GameLibraryGrid />}
          {activeTab === 1 && <GameSessionHistory />}
        </div>
      </div>
    </div>
  );
}
