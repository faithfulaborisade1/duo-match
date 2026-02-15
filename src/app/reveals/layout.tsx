import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Reveal — duomatch',
  description: 'Discover more about your matches through progressive profile reveals on duomatch.',
};

export default function RevealsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
