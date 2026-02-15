import { z } from 'zod';
import { paginationSchema } from './shared';

export const matchesListSchema = paginationSchema.extend({
  status: z.enum(['pending', 'accepted', 'rejected', 'expired', 'completed']).optional(),
  sort: z.enum(['created_at', 'compatibility_score', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const updateMatchSchema = z.object({
  decision: z.enum(['accepted', 'rejected']),
});

export type MatchesListInput = z.infer<typeof matchesListSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
