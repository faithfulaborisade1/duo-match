"use client";

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface SafetyTipsCardProps {
  className?: string;
}

const tips = [
  {
    icon: '🔒',
    title: 'Keep Personal Info Private',
    description: 'Don\'t share your address, phone number, or financial information with people you just met.',
  },
  {
    icon: '🚩',
    title: 'Trust Your Instincts',
    description: 'If something feels off, it probably is. Don\'t hesitate to report or block someone.',
  },
  {
    icon: '🎭',
    title: 'Profiles Are Earned',
    description: 'On duomatch, profiles are revealed through gameplay — not curated. Enjoy the discovery process.',
  },
  {
    icon: '🤖',
    title: 'AI Moderation',
    description: 'Our AI reviews messages to keep conversations safe. Flagged content is reviewed by humans.',
  },
  {
    icon: '📢',
    title: 'Report Concerns',
    description: 'Use the report button to flag any behavior that makes you uncomfortable. Reports are confidential.',
  },
  {
    icon: '🛡️',
    title: 'Block If Needed',
    description: 'You can block any user at any time. They won\'t be notified and can\'t contact you.',
  },
];

export function SafetyTipsCard({ className }: SafetyTipsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>🛡️ Safety Tips</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3 rounded-lg border border-neutral-100 p-3">
              <span className="flex-shrink-0 text-xl">{tip.icon}</span>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">{tip.title}</h4>
                <p className="mt-0.5 text-xs text-neutral-500">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
