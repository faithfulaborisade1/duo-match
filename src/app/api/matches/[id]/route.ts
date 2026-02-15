import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateMatchSchema } from '@/lib/validations/matches';
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
      return errorResponse('Invalid match ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: match, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1:profiles!matches_player1_id_fkey(id, display_name, avatar_url, bio, interests, play_style),
        player2:profiles!matches_player2_id_fkey(id, display_name, avatar_url, bio, interests, play_style),
        match_scores(*),
        game_sessions(id, game_id, status, created_at, completed_at, cooperation_score, games(name, slug, thumbnail_url))
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFoundResponse('Match not found');
      }
      return errorResponse('Failed to fetch match', 500);
    }

    // Ensure user is part of this match
    if (match.player1_id !== user.id && match.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this match');
    }

    return successResponse(match);
  } catch (error) {
    console.error('Match fetch error:', error);
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
      return errorResponse('Invalid match ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = updateMatchSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    // Get the match first
    const { data: match, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return notFoundResponse('Match not found');
      }
      return errorResponse('Failed to fetch match', 500);
    }

    if (match.player1_id !== user.id && match.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this match');
    }

    if (match.status !== 'pending') {
      return errorResponse('This match has already been decided', 400);
    }

    const { decision } = parsed.data;
    const isPlayer1 = match.player1_id === user.id;

    // Update the player's decision
    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (isPlayer1) {
      updateFields.player1_decision = decision;
    } else {
      updateFields.player2_decision = decision;
    }

    // If the other player already decided, check for mutual acceptance
    const otherDecision = isPlayer1 ? match.player2_decision : match.player1_decision;

    if (decision === 'rejected' || otherDecision === 'rejected') {
      updateFields.status = 'rejected';
    } else if (decision === 'accepted' && otherDecision === 'accepted') {
      updateFields.status = 'accepted';
    }

    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update(updateFields)
      .eq('id', id)
      .select(`
        *,
        player1:profiles!matches_player1_id_fkey(id, display_name),
        player2:profiles!matches_player2_id_fkey(id, display_name)
      `)
      .single();

    if (updateError) {
      return handleDbError(updateError);
    }

    return successResponse(updatedMatch);
  } catch (error) {
    console.error('Match update error:', error);
    return errorResponse('Internal server error', 500);
  }
}
