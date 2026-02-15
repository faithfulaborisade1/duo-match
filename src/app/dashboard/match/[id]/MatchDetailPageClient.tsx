"use client";

import { useRouter } from "next/navigation";
import { useMatch, useUpdateMatch } from "@/hooks/use-matches";
import { useRevealStatus, useInitiateReveal } from "@/hooks/use-reveals";
import { MatchScoreBreakdown } from "@/components/features/matching/MatchScoreBreakdown";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

interface MatchDetailPageClientProps {
  matchId: string;
}

export function MatchDetailPageClient({ matchId }: MatchDetailPageClientProps) {
  const router = useRouter();
  const { data: match, isLoading, isError } = useMatch(matchId);
  const updateMatch = useUpdateMatch();

  const otherUserId = (match as any)?.otherUser?.id || (match as any)?.profile?.id;
  const { data: revealStatus } = useRevealStatus(otherUserId || "");
  const initiateReveal = useInitiateReveal();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Alert variant="error">Failed to load match details.</Alert>
        <div className="mt-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
        </div>
      </div>
    );
  }

  const profile = (match as any).profile || (match as any).otherUser;
  const scoreBreakdown = (match as any).scoreBreakdown || {};
  const sharedInterests: string[] = Array.isArray((match as any).sharedInterests) ? (match as any).sharedInterests : [];
  const revealLevel = (revealStatus as any)?.level || 0;

  const handleReveal = () => {
    if (otherUserId) {
      initiateReveal.mutate({ targetUserId: otherUserId });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar
                    size="xl"
                    name={profile?.displayName || "User"}
                    src={profile?.avatarUrl}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-neutral-900">
                        {profile?.displayName || "Anonymous"}
                      </h1>
                      <Badge
                        variant={
                          (match as any).status === "matched" ? "success" :
                          (match as any).status === "liked" ? "primary" : "secondary"
                        }
                      >
                        {(match as any).status === "matched" ? "Matched" :
                         (match as any).status === "liked" ? "Liked" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-neutral-600 mt-2">
                      {profile?.bio || "Profile is still being revealed..."}
                    </p>
                  </div>
                </div>

                {/* Profile Reveal Level */}
                <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">Profile reveal level</span>
                    <span className="text-sm font-semibold text-primary-600">Level {revealLevel}/5</span>
                  </div>
                  <ProgressBar value={(revealLevel / 5) * 100} variant="primary" size="sm" />
                  <p className="text-xs text-neutral-500 mt-2">
                    Play more games together to unlock more profile details.
                  </p>
                  {revealLevel < 5 && (match as any).status === "matched" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={handleReveal}
                      disabled={initiateReveal.isPending}
                    >
                      {initiateReveal.isPending ? "Requesting..." : "Request reveal"}
                    </Button>
                  )}
                </div>

                {/* Shared Interests */}
                {sharedInterests.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-neutral-700 mb-2">Shared interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {sharedInterests.map((interest: string) => (
                        <Tag key={interest}>{interest}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Actions */}
            {(match as any).status === "matched" && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-4">What would you like to do?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => router.push("/games")}
                    >
                      <span className="mr-2">🎮</span>
                      Play a game together
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full"
                      onClick={() => router.push("/chat")}
                    >
                      <span className="mr-2">💬</span>
                      Start chatting
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {(match as any).status === "pending" && (
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => updateMatch.mutate({ id: matchId, data: { status: "liked" } as any })}
                  disabled={updateMatch.isPending}
                >
                  Like this match
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    updateMatch.mutate(
                      { id: matchId, data: { status: "passed" } as any },
                      { onSuccess: () => router.push("/dashboard") }
                    );
                  }}
                  disabled={updateMatch.isPending}
                >
                  Pass
                </Button>
              </div>
            )}
          </div>

          {/* Score Breakdown Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
              </CardHeader>
              <CardBody>
                <MatchScoreBreakdown
                  breakdown={scoreBreakdown}
                  totalScore={(match as any).score || 0}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
