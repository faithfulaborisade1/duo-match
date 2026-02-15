import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-primary-600 py-20 sm:py-28 dark:bg-primary-700">
      <div className="absolute inset-0">
        <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary-500/50 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-primary-700/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to connect through play?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
          Join thousands of people building meaningful connections through cooperative games.
          Your next great friendship is one game away.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/signup">
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[200px] border-0 bg-white text-base font-semibold text-primary-700 hover:bg-primary-50"
            >
              Sign Up Free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px] border-white/30 text-base text-white hover:bg-white/10"
            >
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-primary-200">
          Free forever plan available. Upgrade anytime.
        </p>
      </div>
    </section>
  );
}
