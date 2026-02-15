import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { leaderboardSchema } from '@/lib/validations/leaderboard';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-utils';
import { paginationMeta, paginationRange } from '@/lib/validations/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = leaderboardSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, period, type } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    if (type === 'duo') {
      const { data: entries, error, count } = await supabase
        .from('duo_leaderboard_entries')
        .select(`
          *,
          player1:profiles!duo_leaderboard_entries_player1_id_fkey(id, display_name, avatar_url),
          player2:profiles!duo_leaderboard_entries_player2_id_fkey(id, display_name, avatar_url)
        `, { count: 'exact' })
        .eq('period', period)
        .order('rank', { ascending: true })
        .range(from, to);

      if (error) {
        console.error('Duo leaderboard error:', error);
        return errorResponse('Failed to fetch leaderboard', 500);
      }

      return successResponse({
        data: entries,
        type: 'duo',
        period,
        pagination: paginationMeta(page, pageSize, count || 0),
      });
    }

    // Solo leaderboard
    const { data: entries, error, count } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        profile:profiles!leaderboard_entries_user_id_fkey(id, display_name, avatar_url)
      `, { count: 'exact' })
      .eq('period', period)
      .order('rank', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Leaderboard error:', error);
      return errorResponse('Failed to fetch leaderboard', 500);
    }

    return successResponse({
      data: entries,
      type: 'solo',
      period,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return errorResponse('Internal server error', 500);
  }
}
