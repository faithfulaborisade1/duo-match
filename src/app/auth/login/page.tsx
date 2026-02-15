import type { Metadata } from "next";
import { LoginPageClient } from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Sign In — duomatch",
  description: "Sign in to your duomatch account to connect with people through play.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
