import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { appealsListSchema } from '@/lib/validations/admin';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-utils';
import { paginationMeta, paginationRange } from '@/lib/validations/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Check admin or moderator role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
      return forbiddenResponse('Moderator access required');
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = appealsListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, status } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('appeals')
      .select(`
        *,
        user:profiles!appeals_user_id_fkey(id, display_name, avatar_url, status),
        suspension:user_suspensions(*),
        reviewer:profiles!appeals_reviewed_by_fkey(id, display_name)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: appeals, error, count } = await query;

    if (error) {
      console.error('Appeals list error:', error);
      return errorResponse('Failed to fetch appeals', 500);
    }

    return successResponse({
      data: appeals,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Appeals list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
