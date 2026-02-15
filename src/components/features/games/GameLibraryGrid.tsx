"use client";

import { useState } from "react";
import { useGames } from "@/hooks/use-games";
import { GameCard } from "@/components/features/games/GameCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";
import type { Game, GameCategory } from "@/types/api";

const CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: "all", label: "All Games", icon: "🎮" },
  { value: "strategy", label: "Strategy", icon: "♟️" },
  { value: "puzzle", label: "Puzzle", icon: "🧩" },
  { value: "word", label: "Word", icon: "📝" },
  { value: "trivia", label: "Trivia", icon: "🧠" },
  { value: "card", label: "Card", icon: "🃏" },
];

export function GameLibraryGrid() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: games, isLoading, isError } = useGames({
    category: selectedCategory !== "all" ? (selectedCategory as GameCategory) : undefined,
    search: search || undefined,
  });

  const gamesList = Array.isArray(games) ? games : (games as any)?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Search games..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
              selectedCategory === cat.value
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-primary-300 hover:text-primary-600"
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <Alert variant="error">Failed to load games. Please try again later.</Alert>
      )}

      {/* Empty */}
      {!isLoading && !isError && gamesList.length === 0 && (
        <EmptyState
          title="No games found"
          description={search ? `No games matching "${search}"` : "No games available in this category yet."}
          action={
            search
              ? {
                  label: "Clear search",
                  onClick: () => {
                    setSearch("");
                    setSelectedCategory("all");
                  },
                }
              : undefined
          }
        />
      )}

      {/* Games Grid */}
      {!isLoading && !isError && gamesList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((game: Game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
