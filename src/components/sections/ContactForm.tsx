'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useContact } from '@/hooks/use-contact';

const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'press', label: 'Press & Media' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitContact, isPending, error } = useContact();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(value: string) {
    setFormData((prev) => ({ ...prev, subject: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitContact(
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setFormData({ name: '', email: '', subject: 'general', message: '' });
        },
      }
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-success-200 bg-success-50 p-8 text-center dark:border-success-800 dark:bg-success-950">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 dark:bg-success-900">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success-600 dark:text-success-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Message Sent!
        </h3>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Thank you for reaching out. We typically respond within 24 hours during business days.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error">
          Something went wrong. Please try again or email us directly.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jane Smith"
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jane@example.com"
          required
        />
      </div>

      <Select
        label="What can we help with?"
        options={SUBJECT_OPTIONS}
        value={formData.subject}
        onChange={handleSelectChange}
      />

      <Textarea
        label="Your Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us how we can help..."
        rows={5}
        required
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
