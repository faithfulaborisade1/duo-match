import { HOW_IT_WORKS_STEPS } from '@/lib/constants';

export function HowItWorks() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-28 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            How duomatch works
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            From signup to your first connection in under 5 minutes.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            <div className="absolute left-8 top-0 hidden h-full w-px bg-primary-200 sm:block dark:bg-primary-800" />

            <div className="space-y-12">
              {Array.isArray(HOW_IT_WORKS_STEPS) &&
                HOW_IT_WORKS_STEPS.map((item) => (
                  <div key={item.step} className="relative flex gap-6 sm:gap-8">
                    <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-lg shadow-primary-600/25">
                      {item.step}
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-neutral-600 dark:text-neutral-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
