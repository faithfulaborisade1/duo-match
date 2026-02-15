import type { Metadata } from "next";
import { DashboardPageClient } from "./DashboardPageClient";

export const metadata: Metadata = {
  title: "Dashboard — duomatch",
  description: "Your AI-powered matching dashboard. Discover new matches, manage connections, and track your activity.",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
