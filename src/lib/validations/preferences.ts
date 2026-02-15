import { z } from 'zod';

export const preferencesSchema = z.object({
  min_age: z.number().int().min(18).max(100).default(18),
  max_age: z.number().int().min(18).max(100).default(50),
  preferred_genders: z.array(z.enum(['male', 'female', 'non_binary', 'other'])).min(1),
  max_distance_km: z.number().int().min(1).max(20000).nullable().optional(),
  connection_types: z.array(z.enum(['friendship', 'romantic', 'activity_partner', 'any'])).min(1),
  preferred_play_styles: z.array(z.enum(['casual', 'competitive', 'cooperative', 'creative'])).optional(),
  preferred_game_categories: z.array(z.enum(['word', 'trivia', 'puzzle', 'creative', 'strategy', 'social_deduction'])).optional(),
  deal_breakers: z.record(z.unknown()).optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
