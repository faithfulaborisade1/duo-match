import { z } from 'zod';

export const completeStepSchema = z.object({
  step: z.enum([
    'profile_basics',
    'preferences',
    'interests',
    'game_tutorial',
    'first_match',
  ]),
  data: z.record(z.unknown()).optional(),
});

export type CompleteStepInput = z.infer<typeof completeStepSchema>;
