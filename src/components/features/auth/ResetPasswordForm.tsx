"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const resetPassword = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    resetPassword.mutate(
      { token, password },
      {
        onSuccess: () => {
          router.push("/auth/login?reset=success");
        },
      }
    );
  };

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <Alert variant="error">Invalid or missing reset token. Please request a new password reset link.</Alert>
        <Link
          href="/auth/forgot-password"
          className="inline-block text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(resetPassword.isError || validationError) && (
        <Alert variant="error">
          {validationError || (resetPassword.error as Error)?.message || "Something went wrong. Please try again."}
        </Alert>
      )}

      <p className="text-sm text-neutral-600">
        Enter your new password below.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700 mb-1">
            New password
          </label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirm new password
          </label>
          <Input
            id="confirm-new-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={resetPassword.isPending || !password || !confirmPassword}
      >
        {resetPassword.isPending ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
