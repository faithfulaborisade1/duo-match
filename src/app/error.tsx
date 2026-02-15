'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-neutral-950">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-error-100 dark:bg-error-900/50">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-error-600 dark:text-error-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          We hit an unexpected error. Don&apos;t worry—our team has been notified and is looking
          into it. You can try again or head back to safety.
        </p>

        {error.digest && (
          <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-600">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
