import { z } from 'zod';
import { paginationSchema } from './shared';

export const createGameSessionSchema = z.object({
  match_id: z.string().uuid(),
  game_id: z.string().uuid(),
});

export const updateGameSessionSchema = z.object({
  game_state: z.record(z.unknown()).optional(),
  player1_score: z.number().int().min(0).optional(),
  player2_score: z.number().int().min(0).optional(),
  status: z.enum(['in_progress', 'paused']).optional(),
});

export const endGameSessionSchema = z.object({
  player1_score: z.number().int().min(0),
  player2_score: z.number().int().min(0),
  cooperation_score: z.number().int().min(0).max(100),
  game_state: z.record(z.unknown()).optional(),
});

export const gameSessionHistorySchema = paginationSchema.extend({
  game_id: z.string().uuid().optional(),
  status: z.enum(['waiting', 'in_progress', 'completed', 'abandoned', 'paused']).optional(),
});

export type CreateGameSessionInput = z.infer<typeof createGameSessionSchema>;
export type UpdateGameSessionInput = z.infer<typeof updateGameSessionSchema>;
export type EndGameSessionInput = z.infer<typeof endGameSessionSchema>;
export type GameSessionHistoryInput = z.infer<typeof gameSessionHistorySchema>;
