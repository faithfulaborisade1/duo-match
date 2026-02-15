import { Metadata } from 'next';
import { SafetyPageContent } from '@/components/features/safety/SafetyPageContent';

export const metadata: Metadata = {
  title: 'Safety & Reporting — duomatch',
  description: 'Learn about safety features, community guidelines, and how to report concerns on duomatch.',
};

export default function SafetyPage() {
  return <SafetyPageContent />;
}
