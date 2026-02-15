import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { gameSessionHistorySchema } from '@/lib/validations/game-sessions';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-utils';
import { paginationMeta, paginationRange } from '@/lib/validations/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = gameSessionHistorySchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, game_id, status } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('game_sessions')
      .select(`
        *,
        games(id, name, slug, category, thumbnail_url),
        player1:profiles!game_sessions_player1_id_fkey(id, display_name, avatar_url),
        player2:profiles!game_sessions_player2_id_fkey(id, display_name, avatar_url)
      `, { count: 'exact' })
      .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

    if (game_id) {
      query = query.eq('game_id', game_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: sessions, error, count } = await query;

    if (error) {
      console.error('Game session history error:', error);
      return errorResponse('Failed to fetch game session history', 500);
    }

    return successResponse({
      data: sessions,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Game session history error:', error);
    return errorResponse('Internal server error', 500);
  }
}
