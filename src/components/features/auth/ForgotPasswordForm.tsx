"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPassword } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword.mutate({ email });
  };

  if (forgotPassword.isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Check your email</h3>
          <p className="mt-2 text-sm text-neutral-600">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-block text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {forgotPassword.isError && (
        <Alert variant="error">
          {(forgotPassword.error as Error)?.message || "Something went wrong. Please try again."}
        </Alert>
      )}

      <p className="text-sm text-neutral-600">
        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
      </p>

      <div>
        <label htmlFor="forgot-email" className="block text-sm font-medium text-neutral-700 mb-1">
          Email address
        </label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={forgotPassword.isPending || !email}
      >
        {forgotPassword.isPending ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
