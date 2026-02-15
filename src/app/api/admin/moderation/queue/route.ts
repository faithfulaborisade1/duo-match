import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moderationQueueSchema } from '@/lib/validations/admin';
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
    const parsed = moderationQueueSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, status, reason, sort, order } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reports_reporter_id_fkey(id, display_name, avatar_url),
        reported_user:profiles!reports_reported_user_id_fkey(id, display_name, avatar_url, status)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (reason) {
      query = query.eq('reason', reason);
    }

    query = query.order(sort, { ascending: order === 'asc' }).range(from, to);

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Moderation queue error:', error);
      return errorResponse('Failed to fetch moderation queue', 500);
    }

    return successResponse({
      data: reports,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Moderation queue error:', error);
    return errorResponse('Internal server error', 500);
  }
}
