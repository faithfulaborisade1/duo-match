"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ title, subtitle, children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-neutral-50">
      <div className={cn("mx-auto w-full max-w-md px-4 sm:px-6", className)}>
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-neutral-900">duomatch</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
