import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat — duomatch',
  description: 'Chat with your matches on duomatch. AI-moderated conversations keep things safe and fun.',
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
