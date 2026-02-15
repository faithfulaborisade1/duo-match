import type { Metadata } from "next";
import { GameSessionPageClient } from "./GameSessionPageClient";

export const metadata: Metadata = {
  title: "Game Session — duomatch",
  description: "Play a real-time multiplayer game with your match.",
};

export default async function GameSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameSessionPageClient sessionId={id} />;
}
