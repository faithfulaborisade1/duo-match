import { z } from 'zod';
import { paginationSchema } from './shared';

export const chatChannelsListSchema = paginationSchema.extend({
  status: z.enum(['active', 'archived', 'blocked']).optional(),
});

export const messagesListSchema = paginationSchema.extend({
  before: z.string().datetime().optional(),
  after: z.string().datetime().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  message_type: z.enum(['text', 'emoji', 'game_invite', 'system']).default('text'),
  metadata: z.record(z.unknown()).optional(),
});

export type ChatChannelsListInput = z.infer<typeof chatChannelsListSchema>;
export type MessagesListInput = z.infer<typeof messagesListSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
