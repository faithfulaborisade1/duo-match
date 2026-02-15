"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import type { Match } from "@/types/api";

interface MatchCardProps {
  match: Match;
  onLike?: (id: string) => void;
  onPass?: (id: string) => void;
  onView?: (id: string) => void;
  className?: string;
}

export function MatchCard({ match, onLike, onPass, onView, className }: MatchCardProps) {
  if (!match) return null;

  const scorePercent = typeof match.score === "number" ? Math.round(match.score * 100) : 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar
            size="lg"
            name={match.profile?.displayName || "User"}
            src={match.profile?.avatarUrl}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-neutral-900 truncate">
                {match.profile?.displayName || "Anonymous"}
              </h3>
              {match.status === "matched" && (
                <Badge variant="success" size="sm">Matched</Badge>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-0.5 line-clamp-2">
              {match.profile?.bio || "Profile still revealing..."}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-neutral-600 font-medium">Match score</span>
            <span className="font-semibold text-primary-600">{scorePercent}%</span>
          </div>
          <ProgressBar
            value={scorePercent}
            variant={scorePercent >= 80 ? "success" : scorePercent >= 60 ? "primary" : "warning"}
            size="sm"
          />
        </div>

        {Array.isArray(match.sharedInterests) && match.sharedInterests.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-neutral-500 mb-2">Shared interests</p>
            <div className="flex flex-wrap gap-1">
              {match.sharedInterests.slice(0, 5).map((interest: string) => (
                <Tag key={interest}>{interest}</Tag>
              ))}
              {match.sharedInterests.length > 5 && (
                <span className="text-xs text-neutral-500 self-center">+{match.sharedInterests.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100 px-6 py-3 flex items-center gap-2">
        {match.status === "pending" && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onLike?.(match.id)}
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPass?.(match.id)}
              className="flex-1"
            >
              Pass
            </Button>
          </>
        )}
        {match.status === "matched" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(match.id)}
            className="flex-1"
          >
            View match
          </Button>
        )}
      </div>
    </div>
  );
}
