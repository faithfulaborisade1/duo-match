"use client";

import { useState, useCallback } from 'react';
import { useSubmitReport } from '@/hooks/use-reports';
import { ReportReason, ReportTargetType } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardBody, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ReportFormProps {
  targetType: ReportTargetType;
  targetId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const reasonOptions = [
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'spam', label: 'Spam or scam' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'hate_speech', label: 'Hate speech' },
  { value: 'threats', label: 'Threats or violence' },
  { value: 'underage', label: 'Underage user' },
  { value: 'other', label: 'Other' },
];

const urgencyOptions = [
  { value: 'low', label: 'Low — General concern' },
  { value: 'medium', label: 'Medium — Needs attention soon' },
  { value: 'high', label: 'High — Immediate safety concern' },
];

export function ReportForm({ targetType, targetId, onSuccess, onCancel, className }: ReportFormProps) {
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('low');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitReport, isPending, isError, error } = useSubmitReport();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!reason) return;

      submitReport(
        {
          targetType,
          targetId,
          reason: reason as ReportReason,
          description: description.trim() || undefined,
        },
        {
          onSuccess: () => {
            setSubmitted(true);
            onSuccess?.();
          },
        }
      );
    },
    [reason, description, targetType, targetId, submitReport, onSuccess]
  );

  if (submitted) {
    return (
      <Card className={cn(className)}>
        <CardBody className="py-8 text-center">
          <span className="mb-3 inline-block text-4xl">✅</span>
          <h3 className="text-lg font-bold text-neutral-900">Report Submitted</h3>
          <p className="mt-2 text-sm text-neutral-500">
            Thank you for helping keep duomatch safe. Our team will review your report
            and take appropriate action.
          </p>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} className="mt-4">
              Close
            </Button>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Report {targetType === 'user' ? 'User' : targetType === 'message' ? 'Message' : 'Content'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-5">
          {isError && (
            <Alert variant="error">
              {(error as Error)?.message || 'Failed to submit report. Please try again.'}
            </Alert>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Reason for reporting <span className="text-red-500">*</span>
            </label>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              options={[
                { value: '', label: 'Select a reason…' },
                ...reasonOptions,
              ]}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Urgency Level
            </label>
            <RadioGroup
              name="urgency"
              value={urgency}
              onChange={setUrgency}
              options={urgencyOptions}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Additional details
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide any additional context that might help our team investigate…"
              rows={4}
            />
            <p className="mt-1 text-xs text-neutral-400">
              Optional but helpful for our moderation team.
            </p>
          </div>

          <Alert variant="info">
            <p className="text-xs">
              🛡️ Reports are confidential. The reported user will not know who filed the report.
              False reports may result in account restrictions.
            </p>
          </Alert>
        </CardBody>
        <CardFooter className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={!reason || isPending}>
            {isPending ? <><Spinner size="sm" /> Submitting…</> : 'Submit Report'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
