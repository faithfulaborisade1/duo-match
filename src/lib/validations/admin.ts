import { z } from 'zod';
import { paginationSchema } from './shared';

export const adminUsersListSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(['active', 'suspended', 'banned', 'deactivated']).optional(),
  role: z.enum(['user', 'moderator', 'admin']).optional(),
  sort: z.enum(['created_at', 'display_name', 'last_active_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const moderationQueueSchema = paginationSchema.extend({
  status: z.enum(['pending', 'in_review', 'resolved', 'dismissed', 'escalated']).optional(),
  reason: z.enum([
    'harassment',
    'inappropriate_content',
    'spam',
    'fake_profile',
    'underage',
    'threatening_behavior',
    'hate_speech',
    'other',
  ]).optional(),
  sort: z.enum(['created_at', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const moderationActionSchema = z.object({
  report_id: z.string().uuid(),
  action_type: z.enum(['warning', 'mute', 'suspend', 'ban', 'dismiss', 'escalate']),
  reason: z.string().min(5).max(500),
  duration_hours: z.number().int().min(1).optional(),
  notify_user: z.boolean().default(true),
});

export const appealsListSchema = paginationSchema.extend({
  status: z.enum(['pending', 'under_review', 'approved', 'denied']).optional(),
});

export const reviewAppealSchema = z.object({
  status: z.enum(['approved', 'denied']),
  reviewer_notes: z.string().min(5).max(1000),
});

export const analyticsSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  period: z.enum(['day', 'week', 'month']).default('day'),
});

export type AdminUsersListInput = z.infer<typeof adminUsersListSchema>;
export type ModerationQueueInput = z.infer<typeof moderationQueueSchema>;
export type ModerationActionInput = z.infer<typeof moderationActionSchema>;
export type AppealsListInput = z.infer<typeof appealsListSchema>;
export type ReviewAppealInput = z.infer<typeof reviewAppealSchema>;
export type AnalyticsInput = z.infer<typeof analyticsSchema>;
