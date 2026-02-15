'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PRICING_PLANS } from '@/lib/constants';

export function PricingSection() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
      {Array.isArray(PRICING_PLANS) &&
        PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col rounded-2xl border p-8',
              plan.highlighted
                ? 'border-primary-500 bg-white shadow-xl shadow-primary-500/10 dark:border-primary-400 dark:bg-neutral-900'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary" size="sm">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {plan.description}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-neutral-500 dark:text-neutral-400">/{plan.period}</span>
              )}
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {Array.isArray(plan.features) &&
                plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mt-0.5 flex-shrink-0 text-primary-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
            </ul>

            <Link href="/auth/signup">
              <Button
                variant={plan.highlighted ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
    </div>
  );
}
