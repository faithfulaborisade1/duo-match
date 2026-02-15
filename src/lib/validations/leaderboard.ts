import { z } from 'zod';
import { paginationSchema } from './shared';

export const leaderboardSchema = paginationSchema.extend({
  period: z.enum(['daily', 'weekly', 'monthly', 'all_time']).default('weekly'),
  type: z.enum(['solo', 'duo']).default('solo'),
});

export type LeaderboardInput = z.infer<typeof leaderboardSchema>;
