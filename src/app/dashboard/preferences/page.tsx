import type { Metadata } from "next";
import { PreferencesPageClient } from "./PreferencesPageClient";

export const metadata: Metadata = {
  title: "Match Preferences — duomatch",
  description: "Customize your matching preferences to find the best connections.",
};

export default function PreferencesPage() {
  return <PreferencesPageClient />;
}
