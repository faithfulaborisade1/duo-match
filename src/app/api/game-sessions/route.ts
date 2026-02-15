import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createGameSessionSchema } from '@/lib/validations/game-sessions';
import { createdResponse, errorResponse, validationErrorResponse, unauthorizedResponse, forbiddenResponse, handleDbError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = createGameSessionSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { match_id, game_id } = parsed.data;

    // Verify the user is part of the match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('id, player1_id, player2_id, status')
      .eq('id', match_id)
      .single();

    if (matchError) {
      if (matchError.code === 'PGRST116') {
        return errorResponse('Match not found', 404);
      }
      return errorResponse('Failed to verify match', 500);
    }

    if (match.player1_id !== user.id && match.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this match');
    }

    if (match.status !== 'accepted' && match.status !== 'completed') {
      return errorResponse('Match must be accepted before starting a game', 400);
    }

    // Verify the game exists and is active
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, name')
      .eq('id', game_id)
      .eq('is_active', true)
      .single();

    if (gameError) {
      return errorResponse('Game not found or inactive', 404);
    }

    // Check for existing active session
    const { data: existingSession } = await supabase
      .from('game_sessions')
      .select('id')
      .eq('match_id', match_id)
      .in('status', ['waiting', 'in_progress'])
      .maybeSingle();

    if (existingSession) {
      return errorResponse('There is already an active game session for this match', 409);
    }

    const { data: session, error: createError } = await supabase
      .from('game_sessions')
      .insert({
        match_id,
        game_id,
        player1_id: match.player1_id,
        player2_id: match.player2_id,
        status: 'waiting',
        game_state: {},
      })
      .select(`
        *,
        games(id, name, slug, category, thumbnail_url)
      `)
      .single();

    if (createError) {
      return handleDbError(createError);
    }

    return createdResponse(session);
  } catch (error) {
    console.error('Create game session error:', error);
    return errorResponse('Internal server error', 500);
  }
}
