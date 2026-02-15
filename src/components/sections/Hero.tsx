import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SITE_NAME, SITE_TAGLINE, STATS } from '@/lib/constants';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white dark:from-primary-950/20 dark:via-neutral-950 dark:to-neutral-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary-100/50 blur-3xl dark:bg-primary-900/20" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-secondary-100/50 blur-3xl dark:bg-secondary-900/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-500">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            A new way to connect
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
            {SITE_TAGLINE}.
            <span className="mt-2 block text-primary-600 dark:text-primary-400">
              Build Real Connections.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
            {SITE_NAME} matches you with people who share your interests and connects you through
            cooperative two-player games. No swiping, no small talk—just meaningful connections
            built through play.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="min-w-[200px] text-base">
                Start Playing Free
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="min-w-[200px] text-base">
                Learn How It Works
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
            Free to join. No credit card required.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
          {Array.isArray(STATS) &&
            STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
