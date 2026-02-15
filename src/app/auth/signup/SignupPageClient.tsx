"use client";

import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { SignupForm } from "@/components/features/auth/SignupForm";

export function SignupPageClient() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join duomatch and start making meaningful connections"
    >
      <SignupForm />
    </AuthLayout>
  );
}
