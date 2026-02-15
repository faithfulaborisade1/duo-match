"use client";

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface CommunityGuidelinesProps {
  className?: string;
}

const guidelines = [
  {
    title: 'Be Respectful',
    description: 'Treat everyone with kindness and respect. We\'re all here to connect through play.',
    icon: '💛',
  },
  {
    title: 'Play Fair',
    description: 'No cheating, exploiting bugs, or using third-party tools to gain unfair advantages.',
    icon: '🎮',
  },
  {
    title: 'Keep It Clean',
    description: 'No explicit, offensive, or hateful content. Keep conversations appropriate for all.',
    icon: '✨',
  },
  {
    title: 'Be Authentic',
    description: 'Be yourself. Don\'t impersonate others or misrepresent who you are.',
    icon: '🎭',
  },
  {
    title: 'Protect Privacy',
    description: 'Don\'t share other people\'s personal information without their consent.',
    icon: '🔐',
  },
  {
    title: 'Report Issues',
    description: 'Help us maintain a safe community by reporting violations when you see them.',
    icon: '📋',
  },
];

export function CommunityGuidelines({ className }: CommunityGuidelinesProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>📜 Community Guidelines</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-sm text-neutral-600">
          duomatch is built on the idea that meaningful connections happen through shared experiences.
          To keep our community safe and welcoming, we ask everyone to follow these guidelines.
        </p>
        <div className="space-y-3">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex gap-3 rounded-lg bg-neutral-50 p-4">
              <span className="flex-shrink-0 text-xl">{guideline.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">{guideline.title}</h4>
                <p className="mt-0.5 text-sm text-neutral-600">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <h4 className="text-sm font-bold text-red-800">⚠️ Violations</h4>
          <p className="mt-1 text-xs text-red-700">
            Violating these guidelines may result in warnings, temporary suspensions, or permanent bans
            depending on the severity. Repeated violations will escalate consequences.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
