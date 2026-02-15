import type { Metadata } from "next";
import { ForgotPasswordPageClient } from "./ForgotPasswordPageClient";

export const metadata: Metadata = {
  title: "Forgot Password — duomatch",
  description: "Reset your duomatch password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
