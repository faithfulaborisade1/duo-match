"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMatches, useUpdateMatch, useMatchStats } from "@/hooks/use-matches";
import { useMatchEvents } from "@/hooks/use-matches";
import { MatchCard } from "@/components/features/matching/MatchCard";
import { MatchStatsOverview } from "@/components/features/matching/MatchStatsOverview";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/api";

export function DashboardPageClient() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: statsData, isLoading: statsLoading } = useMatchStats();
  const updateMatch = useUpdateMatch();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Discover", value: "pending" },
    { label: "Matches", value: "matched" },
    { label: "All", value: "all" },
  ];

  const statusFilter = tabs[activeTab].value;
  const { data: matchesData, isLoading: matchesLoading, isError: matchesError } = useMatches(
    statusFilter === "all" ? {} : { status: statusFilter as any }
  );

  // Subscribe to real-time match events
  useMatchEvents();

  const matches: Match[] = Array.isArray(matchesData)
    ? matchesData
    : (matchesData as any)?.data ?? [];

  const handleLike = (id: string) => {
    updateMatch.mutate({ id, data: { status: "liked" } as any });
  };

  const handlePass = (id: string) => {
    updateMatch.mutate({ id, data: { status: "passed" } as any });
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/match/${id}`);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Welcome back{user?.profile?.displayName ? `, ${user.profile.displayName}` : ""}! 👋
          </h1>
          <p className="text-neutral-600 mt-1">Discover new connections and manage your matches</p>
        </div>

        {/* Stats */}
        <MatchStatsOverview stats={statsData as any} isLoading={statsLoading} className="mb-8" />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="primary" onClick={() => router.push("/games")}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Browse Games
          </Button>
          <Button variant="ghost" onClick={() => router.push("/dashboard/preferences")}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Preferences
          </Button>
        </div>

        {/* Matches Tabs */}
        <Tabs
          tabs={tabs.map((t) => ({ label: t.label, id: t.value }))}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {/* Loading */}
          {matchesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full mt-4 rounded-full" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {matchesError && (
            <Alert variant="error">Failed to load matches. Please try again.</Alert>
          )}

          {/* Empty */}
          {!matchesLoading && !matchesError && matches.length === 0 && (
            <EmptyState
              title={statusFilter === "pending" ? "No new matches yet" : statusFilter === "matched" ? "No active matches" : "No matches found"}
              description={
                statusFilter === "pending"
                  ? "Check back soon — we're finding people who share your interests!"
                  : statusFilter === "matched"
                  ? "Like some matches to start connecting through games."
                  : "Update your preferences to discover more people."
              }
              action={{
                label: "Update preferences",
                onClick: () => router.push("/dashboard/preferences"),
              }}
            />
          )}

          {/* Matches Grid */}
          {!matchesLoading && !matchesError && matches.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: Match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onLike={handleLike}
                  onPass={handlePass}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
