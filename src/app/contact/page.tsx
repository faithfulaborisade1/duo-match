import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/sections/ContactForm';

export const metadata: Metadata = {
  title: `Contact Us — ${SITE_NAME}`,
  description:
    'Get in touch with the duomatch team. We are here to help with questions about your account, partnerships, press inquiries, and more.',
  openGraph: {
    title: `Contact Us — ${SITE_NAME}`,
    description:
      'Get in touch with the duomatch team. We are here to help with questions about your account, partnerships, press inquiries, and more.',
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-28 dark:from-primary-950/20 dark:to-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                Get in touch
              </h1>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                Have a question, suggestion, or just want to say hello? We would love to hear from
                you.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Send us a message
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  Fill out the form below and we will get back to you within 24 hours.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Other ways to reach us
                </h2>

                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Email</h3>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Phone</h3>
                      <a
                        href={`tel:${CONTACT_INFO.phone}`}
                        className="text-sm text-neutral-600 dark:text-neutral-400"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Office</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {CONTACT_INFO.address.full}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Hours</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {CONTACT_INFO.hours}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    Need immediate help?
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    For urgent safety concerns or account issues, please email{' '}
                    <a
                      href="mailto:safety@duomatch.app"
                      className="font-medium text-primary-600 dark:text-primary-400"
                    >
                      safety@duomatch.app
                    </a>{' '}
                    and we will respond as quickly as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
