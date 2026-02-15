import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { gamesListSchema } from '@/lib/validations/games';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-utils';
import { paginationMeta, paginationRange } from '@/lib/validations/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = gamesListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, category, difficulty, search } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('games')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.order('sort_order', { ascending: true }).range(from, to);

    const { data: games, error, count } = await query;

    if (error) {
      console.error('Games list error:', error);
      return errorResponse('Failed to fetch games', 500);
    }

    return successResponse({
      data: games,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Games list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
