import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profilesListSchema } from '@/lib/validations/profiles';
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
    const parsed = profilesListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, search, gender, minAge, maxAge } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('profiles')
      .select('id, display_name, bio, gender, location, interests, favorite_games, play_style, created_at', { count: 'exact' })
      .neq('id', user.id)
      .eq('status', 'active');

    if (search) {
      query = query.ilike('display_name', `%${search}%`);
    }

    if (gender) {
      query = query.eq('gender', gender);
    }

    if (minAge) {
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - minAge);
      query = query.lte('date_of_birth', maxDate.toISOString().split('T')[0]);
    }

    if (maxAge) {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - maxAge);
      query = query.gte('date_of_birth', minDate.toISOString().split('T')[0]);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: profiles, error, count } = await query;

    if (error) {
      console.error('Profiles list error:', error);
      return errorResponse('Failed to fetch profiles', 500);
    }

    return successResponse({
      data: profiles,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Profiles list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
