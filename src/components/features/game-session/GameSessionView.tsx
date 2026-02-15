"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGameSession, useUpdateGameSession, useEndGameSession } from "@/hooks/use-game-sessions";
import { useCurrentUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Card, CardBody } from "@/components/ui/Card";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

interface GameSessionViewProps {
  sessionId: string;
}

export function GameSessionView({ sessionId }: GameSessionViewProps) {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: session, isLoading, isError, refetch } = useGameSession(sessionId);
  const updateSession = useUpdateGameSession();
  const endSession = useEndGameSession();
  const [showEndModal, setShowEndModal] = useState(false);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  // Auto-refresh session state every 3 seconds for real-time feel
  useEffect(() => {
    if (!session || session.status === "completed" || session.status === "abandoned") return;
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [session, refetch]);

  const handleMakeMove = useCallback(() => {
    if (!selectedMove || !session) return;
    updateSession.mutate(
      {
        id: sessionId,
        data: {
          move: selectedMove,
          status: "active",
        } as any,
      },
      {
        onSuccess: () => {
          setSelectedMove(null);
          refetch();
        },
      }
    );
  }, [selectedMove, session, sessionId, updateSession, refetch]);

  const handleEndGame = useCallback(() => {
    endSession.mutate(
      { id: sessionId },
      {
        onSuccess: () => {
          setShowEndModal(false);
          refetch();
        },
      }
    );
  }, [sessionId, endSession, refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="lg" />
        <p className="text-neutral-600">Loading game session...</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert variant="error">Failed to load game session. It may have expired or been removed.</Alert>
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={() => router.push("/games")}>Back to games</Button>
        </div>
      </div>
    );
  }

  const isCompleted = session.status === "completed" || session.status === "abandoned";
  const isMyTurn = (session as any).currentTurn === user?.id;
  const players = Array.isArray((session as any).players) ? (session as any).players : [];
  const moves = Array.isArray((session as any).moves) ? (session as any).moves : [];
  const gameState = (session as any).gameState || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <span className="text-2xl">{(session as any).game?.icon || "🎮"}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                {(session as any).game?.name || "Game Session"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    session.status === "active" ? "success" :
                    session.status === "waiting" ? "warning" :
                    session.status === "completed" ? "secondary" :
                    "error"
                  }
                >
                  {session.status === "active" ? "In Progress" :
                   session.status === "waiting" ? "Waiting for Player" :
                   session.status === "completed" ? "Completed" :
                   "Ended"}
                </Badge>
                {!isCompleted && isMyTurn && (
                  <Badge variant="primary">Your turn</Badge>
                )}
              </div>
            </div>
          </div>

          {!isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEndModal(true)}
            >
              End game
            </Button>
          )}
        </div>

        {/* Players */}
        <div className="flex items-center justify-center gap-8 mt-6">
          {players.map((player: any, index: number) => (
            <div key={player.id || index} className="flex flex-col items-center gap-2">
              <div className={cn(
                "p-1 rounded-full",
                (session as any).currentTurn === player.id ? "ring-2 ring-primary-500" : ""
              )}>
                <Avatar
                  size="lg"
                  name={player.displayName || "Player"}
                  src={player.avatarUrl}
                />
              </div>
              <span className="text-sm font-medium text-neutral-900">{player.displayName || "Player"}</span>
              <span className="text-lg font-bold text-primary-600">{player.score ?? 0}</span>
            </div>
          ))}
          {players.length === 2 && (
            <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-neutral-300">
              VS
            </div>
          )}
        </div>
      </div>

      {/* Game Board / Area */}
      <Card>
        <CardBody className="p-6">
          {session.status === "waiting" && (
            <div className="text-center py-12">
              <Spinner size="lg" />
              <p className="text-neutral-600 mt-4">Waiting for your opponent to join...</p>
              <p className="text-sm text-neutral-500 mt-1">Share this session to invite them</p>
            </div>
          )}

          {session.status === "active" && (
            <div className="space-y-6">
              {/* Turn indicator */}
              {isMyTurn ? (
                <Alert variant="info">It&apos;s your turn! Make your move below.</Alert>
              ) : (
                <Alert variant="warning">Waiting for your opponent&apos;s move...</Alert>
              )}

              {/* Game state visualization */}
              <div className="bg-neutral-50 rounded-xl p-6">
                {gameState.board ? (
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {Array.isArray(gameState.board) && gameState.board.map((cell: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => isMyTurn && !cell && setSelectedMove(String(idx))}
                        disabled={!isMyTurn || !!cell}
                        className={cn(
                          "aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all",
                          cell ? "border-neutral-300 bg-white" : "border-dashed border-neutral-300 hover:border-primary-400 hover:bg-primary-50",
                          selectedMove === String(idx) && "border-primary-600 bg-primary-100",
                          !isMyTurn && "cursor-not-allowed opacity-60"
                        )}
                      >
                        {cell || ""}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-neutral-600">Game in progress</p>
                    {gameState.question && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{gameState.question}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                          {Array.isArray(gameState.options) && gameState.options.map((option: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => isMyTurn && setSelectedMove(option)}
                              disabled={!isMyTurn}
                              className={cn(
                                "p-3 rounded-xl border-2 text-left font-medium transition-all",
                                selectedMove === option
                                  ? "border-primary-600 bg-primary-50 text-primary-700"
                                  : "border-neutral-200 hover:border-primary-300 text-neutral-700",
                                !isMyTurn && "cursor-not-allowed opacity-60"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!gameState.question && !gameState.board && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-neutral-500">Round {gameState.round || 1}</p>
                        {gameState.timeRemaining && (
                          <ProgressBar
                            value={(gameState.timeRemaining / (gameState.totalTime || 60)) * 100}
                            variant="primary"
                            size="sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Move submission */}
              {isMyTurn && selectedMove && (
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleMakeMove}
                    disabled={updateSession.isPending}
                  >
                    {updateSession.isPending ? "Submitting..." : "Submit move"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🏆</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {session.status === "completed" ? "Game Complete!" : "Game Ended"}
                </h2>
                {(session as any).winner && (
                  <p className="text-neutral-600 mt-2">
                    {(session as any).winner === user?.id ? "Congratulations, you won!" : "Better luck next time!"}
                  </p>
                )}
              </div>

              {/* Final scores */}
              <div className="flex items-center justify-center gap-12">
                {players.map((player: any, index: number) => (
                  <div key={player.id || index} className="text-center">
                    <Avatar
                      size="lg"
                      name={player.displayName || "Player"}
                      src={player.avatarUrl}
                    />
                    <p className="font-medium text-neutral-900 mt-2">{player.displayName || "Player"}</p>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{player.score ?? 0}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="primary" onClick={() => router.push("/games")}>
                  Play another game
                </Button>
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                  Back to dashboard
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Move History */}
      {moves.length > 0 && (
        <Card>
          <CardBody className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Move History</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {moves.map((move: any, index: number) => (
                <div
                  key={move.id || index}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm",
                    move.playerId === user?.id ? "bg-primary-50" : "bg-neutral-50"
                  )}
                >
                  <span className="text-xs text-neutral-400 w-6">#{index + 1}</span>
                  <span className="font-medium text-neutral-700">
                    {move.playerId === user?.id ? "You" : "Opponent"}
                  </span>
                  <span className="text-neutral-600">{move.action || move.value || "Made a move"}</span>
                  {move.timestamp && (
                    <span className="ml-auto text-xs text-neutral-400">
                      {new Date(move.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* End Game Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End game?"
      >
        <p className="text-neutral-600">
          Are you sure you want to end this game session? This action cannot be undone.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowEndModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleEndGame}
            disabled={endSession.isPending}
          >
            {endSession.isPending ? "Ending..." : "End game"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
