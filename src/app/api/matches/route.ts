import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { matchesListSchema } from '@/lib/validations/matches';
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
    const parsed = matchesListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, status, sort, order } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('matches')
      .select(`
        *,
        player1:profiles!matches_player1_id_fkey(id, display_name, avatar_url, interests, play_style),
        player2:profiles!matches_player2_id_fkey(id, display_name, avatar_url, interests, play_style),
        match_scores(*)
      `, { count: 'exact' })
      .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order(sort, { ascending: order === 'asc' }).range(from, to);

    const { data: matches, error, count } = await query;

    if (error) {
      console.error('Matches list error:', error);
      return errorResponse('Failed to fetch matches', 500);
    }

    return successResponse({
      data: matches,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Matches list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
