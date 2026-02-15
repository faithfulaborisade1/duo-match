"use client";

import Link from "next/link";
import { useGameSessionHistory } from "@/hooks/use-game-sessions";
import { useCurrentUser } from "@/hooks/use-auth";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { GameSession } from "@/types/api";

export function GameSessionHistory() {
  const { data: user } = useCurrentUser();
  const { data: historyData, isLoading, isError } = useGameSessionHistory({});

  const sessions: GameSession[] = Array.isArray(historyData)
    ? historyData
    : (historyData as any)?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <Alert variant="error">Failed to load game history.</Alert>;
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No games played yet"
        description="Start a game with one of your matches to see your history here."
        action={{
          label: "Browse games",
          onClick: () => window.location.href = "/games",
        }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session: GameSession) => {
        const players = Array.isArray((session as any).players) ? (session as any).players : [];
        const opponent = players.find((p: any) => p.id !== user?.id);
        const isWinner = (session as any).winner === user?.id;
        const isDraw = session.status === "completed" && !(session as any).winner;

        return (
          <Link key={session.id} href={`/games/session/${session.id}`}>
            <Card className="hover:shadow-sm transition-all cursor-pointer">
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-xl">
                    {(session as any).game?.icon || "🎮"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">
                      {(session as any).game?.name || "Game"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {opponent && (
                        <span className="text-sm text-neutral-600">vs {opponent.displayName || "Opponent"}</span>
                      )}
                      {session.createdAt && (
                        <span className="text-xs text-neutral-400">
                          {formatRelativeTime(new Date(session.createdAt))}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      session.status === "completed"
                        ? isWinner ? "success" : isDraw ? "secondary" : "error"
                        : session.status === "active" ? "primary" : "warning"
                    }
                    size="sm"
                  >
                    {session.status === "completed"
                      ? isWinner ? "Won" : isDraw ? "Draw" : "Lost"
                      : session.status === "active" ? "Active" : "Waiting"}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
