import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: `Page Not Found — ${SITE_NAME}`,
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-4 dark:bg-neutral-950">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-primary-600 dark:text-primary-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>

          <h1 className="text-6xl font-extrabold text-neutral-900 dark:text-white">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
            Page not found
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Looks like this page wandered off to play a game somewhere. Let&apos;s get you back on
            track.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
