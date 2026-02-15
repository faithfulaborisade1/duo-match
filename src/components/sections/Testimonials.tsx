import { TESTIMONIALS } from '@/lib/constants';

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            People are connecting every day
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Hear from members who found real connections through play.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {Array.isArray(TESTIMONIALS) &&
            TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mb-4 text-primary-200 dark:text-primary-800"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {testimonial.quote}
                </p>
                <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
