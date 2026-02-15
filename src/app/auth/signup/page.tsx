import type { Metadata } from "next";
import { SignupPageClient } from "./SignupPageClient";

export const metadata: Metadata = {
  title: "Sign Up — duomatch",
  description: "Create your duomatch account and start connecting with people through cooperative two-player games.",
};

export default function SignupPage() {
  return <SignupPageClient />;
}
