import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateGameSessionSchema } from '@/lib/validations/game-sessions';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse, handleDbError } from '@/lib/api-utils';
import { uuidSchema } from '@/lib/validations/shared';

export async function GET(
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

    const { data: session, error } = await supabase
      .from('game_sessions')
      .select(`
        *,
        games(id, name, slug, category, description, rules, thumbnail_url),
        player1:profiles!game_sessions_player1_id_fkey(id, display_name, avatar_url),
        player2:profiles!game_sessions_player2_id_fkey(id, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFoundResponse('Game session not found');
      }
      return errorResponse('Failed to fetch game session', 500);
    }

    if (session.player1_id !== user.id && session.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this game session');
    }

    return successResponse(session);
  } catch (error) {
    console.error('Game session fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(
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
    const parsed = updateGameSessionSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    // Verify user is part of the session
    const { data: existing, error: fetchError } = await supabase
      .from('game_sessions')
      .select('id, player1_id, player2_id, status')
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

    const updateData: Record<string, unknown> = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    // If session was waiting and we're updating state, move to in_progress
    if (existing.status === 'waiting' && parsed.data.game_state) {
      updateData.status = 'in_progress';
      updateData.started_at = new Date().toISOString();
    }

    const { data: session, error: updateError } = await supabase
      .from('game_sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return handleDbError(updateError);
    }

    return successResponse(session);
  } catch (error) {
    console.error('Game session update error:', error);
    return errorResponse('Internal server error', 500);
  }
}
