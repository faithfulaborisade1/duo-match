import type { Metadata } from "next";
import { ResetPasswordPageClient } from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  title: "Reset Password — duomatch",
  description: "Set a new password for your duomatch account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
