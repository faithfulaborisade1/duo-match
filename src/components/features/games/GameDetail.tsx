"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/use-games";
import { useMatches } from "@/hooks/use-matches";
import { useCreateGameSession } from "@/hooks/use-game-sessions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/api";

interface GameDetailProps {
  slug: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  strategy: "♟️",
  puzzle: "🧩",
  word: "📝",
  trivia: "🧠",
  card: "🃏",
};

export function GameDetail({ slug }: GameDetailProps) {
  const router = useRouter();
  const { data: game, isLoading, isError } = useGame(slug);
  const { data: matchesData } = useMatches({ status: "matched" as any });
  const createSession = useCreateGameSession();

  const matches: Match[] = Array.isArray(matchesData) ? matchesData : (matchesData as any)?.data ?? [];

  const handleStartGame = (matchId: string) => {
    if (!game) return;
    createSession.mutate(
      { gameId: game.id, matchId } as any,
      {
        onSuccess: (session: any) => {
          router.push(`/games/session/${session.id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !game) {
    return <Alert variant="error">Failed to load game details. Please try again.</Alert>;
  }

  const icon = CATEGORY_ICONS[game.category] || "🎮";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className={cn("h-48 sm:h-64 flex items-center justify-center bg-primary-50")}>
          <span className="text-8xl">{icon}</span>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{game.name}</h1>
                {game.isNew && <Badge variant="primary">New</Badge>}
              </div>
              <p className="text-neutral-600">{game.description}</p>
            </div>
            <Badge variant="secondary" size="lg">{game.category}</Badge>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{game.duration || "5-10 min"}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>2 Players</span>
            </div>
            {typeof game.playCount === "number" && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{game.playCount.toLocaleString()} plays</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How to Play */}
      {game.rules && (
        <Card>
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="prose prose-sm text-neutral-700 max-w-none">
              <p>{game.rules}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Play with a Match */}
      <Card>
        <CardHeader>
          <CardTitle>Play with a match</CardTitle>
        </CardHeader>
        <CardBody>
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-600 mb-4">You need a match to play! Head to the matching dashboard to find someone.</p>
              <Button variant="primary" onClick={() => router.push("/dashboard")}>
                Find matches
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 5).map((match: Match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="md"
                      name={match.profile?.displayName || "User"}
                      src={match.profile?.avatarUrl}
                    />
                    <div>
                      <p className="font-medium text-neutral-900">{match.profile?.displayName || "Anonymous"}</p>
                      <p className="text-xs text-neutral-500">Match score: {Math.round((match.score || 0) * 100)}%</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartGame(match.id)}
                    disabled={createSession.isPending}
                  >
                    {createSession.isPending ? "Starting..." : "Play"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
