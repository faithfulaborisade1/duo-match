import { z } from 'zod';

export const createReportSchema = z.object({
  reported_user_id: z.string().uuid(),
  reason: z.enum([
    'harassment',
    'inappropriate_content',
    'spam',
    'fake_profile',
    'underage',
    'threatening_behavior',
    'hate_speech',
    'other',
  ]),
  description: z.string().min(10, 'Please provide more details').max(1000),
  evidence_urls: z.array(z.string().url()).max(5).optional(),
  related_match_id: z.string().uuid().optional(),
  related_session_id: z.string().uuid().optional(),
  related_message_id: z.string().uuid().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
