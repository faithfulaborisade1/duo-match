import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard & Stats — duomatch',
  description: 'See how you rank against other players, track your achievements, and view your game stats on duomatch.',
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
