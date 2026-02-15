import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminUsersListSchema } from '@/lib/validations/admin';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-utils';
import { paginationMeta, paginationRange } from '@/lib/validations/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return forbiddenResponse('Admin access required');
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = adminUsersListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, search, status, role, sort, order } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('profiles')
      .select(`
        *,
        subscriptions(plan, status),
        user_stats(games_played, total_points)
      `, { count: 'exact' });

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (role) {
      query = query.eq('role', role);
    }

    query = query.order(sort, { ascending: order === 'asc' }).range(from, to);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Admin users list error:', error);
      return errorResponse('Failed to fetch users', 500);
    }

    return successResponse({
      data: users,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
