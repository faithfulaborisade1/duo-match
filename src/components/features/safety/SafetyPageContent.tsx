"use client";

import { SafetyTipsCard } from '@/components/features/safety/SafetyTipsCard';
import { CommunityGuidelines } from '@/components/features/safety/CommunityGuidelines';
import { ReportForm } from '@/components/features/safety/ReportForm';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { useState } from 'react';

const tabs = [
  { id: 'guidelines', label: 'Community Guidelines' },
  { id: 'safety', label: 'Safety Tips' },
  { id: 'report', label: 'File a Report' },
];

export function SafetyPageContent() {
  const [activeTab, setActiveTab] = useState('guidelines');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">Safety & Reporting</h1>
        <p className="mt-1 text-neutral-500">
          Your safety is our top priority. Learn how we keep duomatch a welcoming place for everyone.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        <TabPanel tabId="guidelines" activeTab={activeTab}>
          <CommunityGuidelines />
        </TabPanel>

        <TabPanel tabId="safety" activeTab={activeTab}>
          <SafetyTipsCard />
        </TabPanel>

        <TabPanel tabId="report" activeTab={activeTab}>
          <div className="mx-auto max-w-xl">
            <ReportForm
              targetType="user"
              targetId=""
              onSuccess={() => {}}
            />
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
