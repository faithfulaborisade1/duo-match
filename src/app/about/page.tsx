import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, TEAM_MEMBERS, STATS } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTA } from '@/components/sections/CTA';

export const metadata: Metadata = {
  title: `About — ${SITE_NAME}`,
  description:
    'Learn about the team and mission behind duomatch — a social connection platform that builds meaningful relationships through cooperative play.',
  openGraph: {
    title: `About — ${SITE_NAME}`,
    description:
      'Learn about the team and mission behind duomatch — a social connection platform that builds meaningful relationships through cooperative play.',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-28 dark:from-primary-950/20 dark:to-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                We believe connections should be
                <span className="text-primary-600 dark:text-primary-400"> earned, not swiped</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                duomatch was born from a simple observation: the best friendships and relationships
                are built through shared experiences, not curated profiles. We created a platform
                where people connect through cooperative play—because nothing reveals who someone
                really is like working together toward a common goal.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white py-20 dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Our Mission</h2>
                <p className="mt-4 text-neutral-600 leading-relaxed dark:text-neutral-400">
                  Traditional social platforms ask you to present a polished version of yourself.
                  Dating apps reduce people to photos and bios. Gaming platforms focus on competition
                  over connection.
                </p>
                <p className="mt-4 text-neutral-600 leading-relaxed dark:text-neutral-400">
                  duomatch is a new category. We match people by shared interests, then connect them
                  through cooperative two-player games where conversation flows naturally. Profiles
                  are progressively revealed through interaction—not curated from selfies. The result?
                  Connections built on who you actually are, not who you pretend to be.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Our Values</h2>
                <ul className="mt-4 space-y-4">
                  <li className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Safety First</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        AI moderation, comprehensive reporting, and proactive safety measures protect every member.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Authenticity Over Curation</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Progressive reveals mean you get to know the real person, not their highlight reel.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Play is Universal</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Games break down barriers and create shared memories. They are the perfect foundation for connection.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Quality Over Quantity</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Every match is intentional. We would rather you have one great connection than a hundred empty ones.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-neutral-200 bg-neutral-50 py-16 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
              {Array.isArray(STATS) &&
                STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="bg-white py-20 sm:py-28 dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
                Meet the team
              </h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                A passionate group of builders who believe in the power of play.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
              {Array.isArray(TEAM_MEMBERS) &&
                TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {member.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {member.bio}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
