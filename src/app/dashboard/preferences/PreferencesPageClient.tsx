"use client";

import { useRouter } from "next/navigation";
import { MatchPreferencesEditor } from "@/components/features/matching/MatchPreferencesEditor";

export function PreferencesPageClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Match Preferences</h1>
          <p className="text-neutral-600 mt-1">Customize who you&apos;d like to be matched with</p>
        </div>

        <MatchPreferencesEditor />
      </div>
    </div>
  );
}
