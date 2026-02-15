import type { Metadata } from "next";
import { GamesPageClient } from "./GamesPageClient";

export const metadata: Metadata = {
  title: "Game Library — duomatch",
  description: "Browse our collection of cooperative two-player games designed to help you connect with your matches.",
};

export default function GamesPage() {
  return <GamesPageClient />;
}
