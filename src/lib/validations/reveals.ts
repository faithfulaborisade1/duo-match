import { z } from 'zod';

export const createRevealSchema = z.object({
  target_user_id: z.string().uuid(),
  reveal_level: z.enum(['bio', 'voice', 'photo']),
});

export type CreateRevealInput = z.infer<typeof createRevealSchema>;
