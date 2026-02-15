import { z } from 'zod';
import { paginationSchema } from './shared';

export const profilesListSchema = paginationSchema.extend({
  search: z.string().optional(),
  gender: z.enum(['male', 'female', 'non_binary', 'other']).optional(),
  minAge: z.coerce.number().int().min(18).optional(),
  maxAge: z.coerce.number().int().max(100).optional(),
});

export const updateProfileSchema = z.object({
  display_name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().nullable().optional(),
  gender: z.enum(['male', 'female', 'non_binary', 'other']).optional(),
  location: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
  interests: z.array(z.string().max(50)).max(20).optional(),
  favorite_games: z.array(z.string().uuid()).max(20).optional(),
});

export type ProfilesListInput = z.infer<typeof profilesListSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
