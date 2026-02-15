"use client";

import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";

export function ForgotPasswordPageClient() {
  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="No worries, we'll help you reset it"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
