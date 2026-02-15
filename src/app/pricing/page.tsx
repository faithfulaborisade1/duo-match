import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingSection } from '@/components/sections/PricingSection';

export const metadata: Metadata = {
  title: `Pricing — ${SITE_NAME}`,
  description:
    'Choose the perfect duomatch plan. Start free and upgrade when you are ready for unlimited matches, the full game library, and premium features.',
  openGraph: {
    title: `Pricing — ${SITE_NAME}`,
    description:
      'Choose the perfect duomatch plan. Start free and upgrade when you are ready for unlimited matches, the full game library, and premium features.',
    url: `${SITE_URL}/pricing`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Can I try duomatch for free?',
    answer:
      'Absolutely! Our Free plan gives you 3 matches per day, access to 10 games, and all the core features. No credit card required.',
  },
  {
    question: 'What happens when I upgrade?',
    answer:
      'You get instant access to all features in your new plan. Both Plus and Premium start with a 7-day free trial so you can explore risk-free.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. You will continue to have access to paid features until the end of your billing period.',
  },
  {
    question: 'Is there a yearly discount?',
    answer:
      'Yes! Annual plans save you 20% compared to monthly billing. You can switch to annual billing from your account settings.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) and process payments securely through Stripe.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a full refund within the first 7 days of any paid subscription. After that, you can cancel to prevent future charges.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-28 dark:from-primary-950/20 dark:to-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                Start free and upgrade when you are ready. Every plan includes our core matching and
                gaming experience.
              </p>
            </div>

            <div className="mt-16">
              <PricingSection />
            </div>
          </div>
        </section>

        {/* Compare Plans */}
        <section className="border-t border-neutral-200 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-neutral-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-12 space-y-6">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">{item.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                Still have questions?{' '}
                <Link
                  href="/contact"
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Contact our team
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
