import type { Metadata } from "next";
import { OnboardingPageClient } from "./OnboardingPageClient";

export const metadata: Metadata = {
  title: "Get Started — duomatch",
  description: "Set up your duomatch profile and start connecting with people through play.",
};

export default function OnboardingPage() {
  return <OnboardingPageClient />;
}
