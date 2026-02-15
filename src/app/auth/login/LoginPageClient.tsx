"use client";

import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { LoginForm } from "@/components/features/auth/LoginForm";

export function LoginPageClient() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue connecting through play"
    >
      <LoginForm />
    </AuthLayout>
  );
}
