import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { endGameSessionSchema } from '@/lib/validations/game-sessions';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse, handleDbError } from '@/lib/api-utils';
import { uuidSchema } from '@/lib/validations/shared';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success) {
      return errorResponse('Invalid session ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = endGameSessionSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    // Verify user is part of the session
    const { data: existing, error: fetchError } = await supabase
      .from('game_sessions')
      .select('id, player1_id, player2_id, match_id, status, started_at')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return notFoundResponse('Game session not found');
      }
      return errorResponse('Failed to fetch game session', 500);
    }

    if (existing.player1_id !== user.id && existing.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this game session');
    }

    if (existing.status === 'completed' || existing.status === 'abandoned') {
      return errorResponse('This game session has already ended', 400);
    }

    const { player1_score, player2_score, cooperation_score, game_state } = parsed.data;
    const now = new Date().toISOString();

    // Calculate duo score: 60% cooperation, 40% game performance
    const gamePerformance = player1_score + player2_score;
    const duoScore = Math.round(cooperation_score * 0.6 + (gamePerformance / 2) * 0.4);

    // Calculate play time
    const startedAt = existing.started_at ? new Date(existing.started_at) : new Date();
    const durationMinutes = Math.round((Date.now() - startedAt.getTime()) / 60000);

    // Update the game session
    const { data: session, error: updateError } = await supabase
      .from('game_sessions')
      .update({
        status: 'completed',
        player1_score,
        player2_score,
        cooperation_score,
        duo_score: duoScore,
        game_state: game_state || {},
        completed_at: now,
        duration_minutes: durationMinutes,
        updated_at: now,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return handleDbError(updateError);
    }

    // Update match score (upsert)
    const { data: existingScore } = await supabase
      .from('match_scores')
      .select('*')
      .eq('match_id', existing.match_id)
      .maybeSingle();

    if (existingScore) {
      const newGamesPlayed = (existingScore.games_played || 0) + 1;
      const newTotalCoop = (existingScore.total_cooperation_score || 0) + cooperation_score;
      const newAvgCoop = Math.round(newTotalCoop / newGamesPlayed);

      await supabase
        .from('match_scores')
        .update({
          games_played: newGamesPlayed,
          total_cooperation_score: newTotalCoop,
          average_cooperation_score: newAvgCoop,
          total_duo_score: (existingScore.total_duo_score || 0) + duoScore,
          last_played_at: now,
          updated_at: now,
        })
        .eq('match_id', existing.match_id);
    } else {
      await supabase
        .from('match_scores')
        .insert({
          match_id: existing.match_id,
          player1_id: existing.player1_id,
          player2_id: existing.player2_id,
          games_played: 1,
          total_cooperation_score: cooperation_score,
          average_cooperation_score: cooperation_score,
          total_duo_score: duoScore,
          last_played_at: now,
        });
    }

    // Update user stats for both players
    for (const playerId of [existing.player1_id, existing.player2_id]) {
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', playerId)
        .maybeSingle();

      const playerScore = playerId === existing.player1_id ? player1_score : player2_score;

      if (userStats) {
        const newGamesPlayed = (userStats.games_played || 0) + 1;
        const newTotalCoop = (userStats.total_cooperation_score || 0) + cooperation_score;

        await supabase
          .from('user_stats')
          .update({
            games_played: newGamesPlayed,
            total_cooperation_score: newTotalCoop,
            average_cooperation_score: Math.round(newTotalCoop / newGamesPlayed),
            total_play_time_minutes: (userStats.total_play_time_minutes || 0) + durationMinutes,
            current_streak: (userStats.current_streak || 0) + 1,
            longest_streak: Math.max(userStats.longest_streak || 0, (userStats.current_streak || 0) + 1),
            total_points: (userStats.total_points || 0) + duoScore,
            updated_at: now,
          })
          .eq('user_id', playerId);
      } else {
        await supabase
          .from('user_stats')
          .insert({
            user_id: playerId,
            games_played: 1,
            total_cooperation_score: cooperation_score,
            average_cooperation_score: cooperation_score,
            total_play_time_minutes: durationMinutes,
            current_streak: 1,
            longest_streak: 1,
            total_points: duoScore,
          });
      }
    }

    // Create point transactions
    for (const playerId of [existing.player1_id, existing.player2_id]) {
      await supabase
        .from('point_transactions')
        .insert({
          user_id: playerId,
          amount: duoScore,
          transaction_type: 'game_completion',
          reference_type: 'game_session',
          reference_id: id,
          description: `Completed game session with duo score of ${duoScore}`,
        });
    }

    return successResponse({
      ...session,
      duo_score: duoScore,
      duration_minutes: durationMinutes,
    });
  } catch (error) {
    console.error('End game session error:', error);
    return errorResponse('Internal server error', 500);
  }
}
