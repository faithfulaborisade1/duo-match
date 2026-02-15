import { z } from 'zod';
import { paginationSchema } from './shared';

export const notificationsListSchema = paginationSchema.extend({
  unreadOnly: z.coerce.boolean().default(false),
});

export const markReadSchema = z.object({
  notification_ids: z.array(z.string().uuid()).min(1).max(100),
});

export type NotificationsListInput = z.infer<typeof notificationsListSchema>;
export type MarkReadInput = z.infer<typeof markReadSchema>;
