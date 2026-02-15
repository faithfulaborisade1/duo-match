"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";

export function SignupForm() {
  const router = useRouter();
  const signup = useSignup();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setValidationError("You must agree to the terms and conditions.");
      return;
    }

    signup.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          router.push("/onboarding");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(signup.isError || validationError) && (
        <Alert variant="error">
          {validationError || (signup.error as Error)?.message || "Something went wrong. Please try again."}
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-neutral-700 mb-1">
            Display name
          </label>
          <Input
            id="signup-name"
            type="text"
            placeholder="How should we call you?"
            value={formData.displayName}
            onChange={handleChange("displayName")}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email address
          </label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange("email")}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange("password")}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formData.password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      level <= passwordStrength.level
                        ? passwordStrength.level <= 1
                          ? "bg-error-500"
                          : passwordStrength.level <= 2
                          ? "bg-warning-500"
                          : passwordStrength.level <= 3
                          ? "bg-primary-500"
                          : "bg-success-500"
                        : "bg-neutral-200"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-1">{passwordStrength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirm password
          </label>
          <Input
            id="signup-confirm"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <Checkbox
        checked={agreedToTerms}
        onChange={setAgreedToTerms}
        label={
          <span className="text-sm text-neutral-600">
            I agree to the{" "}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </span>
        }
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={signup.isPending || !formData.email || !formData.password || !agreedToTerms}
      >
        {signup.isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function getPasswordStrength(password: string): { level: number; label: string } {
  if (password.length === 0) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Weak password" };
  if (score <= 2) return { level: 2, label: "Fair password" };
  if (score <= 3) return { level: 3, label: "Good password" };
  return { level: 4, label: "Strong password" };
}
