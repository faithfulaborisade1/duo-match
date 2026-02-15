import type { Metadata } from "next";
import { MatchDetailPageClient } from "./MatchDetailPageClient";

export const metadata: Metadata = {
  title: "Match Details — duomatch",
  description: "View your match details and score breakdown.",
};

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchDetailPageClient matchId={id} />;
}
