"use client";

import { Suspense } from "react";
import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/features/auth/ResetPasswordForm";
import { Spinner } from "@/components/ui/Spinner";

export function ResetPasswordPageClient() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      <Suspense fallback={<div className="flex justify-center py-8"><Spinner size="lg" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
