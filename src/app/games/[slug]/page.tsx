import type { Metadata } from "next";
import { GameDetailPageClient } from "./GameDetailPageClient";

export const metadata: Metadata = {
  title: "Game Details — duomatch",
  description: "Learn how to play and start a session with one of your matches.",
};

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameDetailPageClient slug={slug} />;
}
