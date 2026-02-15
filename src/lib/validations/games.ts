import { z } from 'zod';
import { paginationSchema } from './shared';

export const gamesListSchema = paginationSchema.extend({
  category: z.enum(['word', 'trivia', 'puzzle', 'creative', 'strategy', 'social_deduction']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  search: z.string().optional(),
});

export type GamesListInput = z.infer<typeof gamesListSchema>;
