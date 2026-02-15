import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationsListSchema } from '@/lib/validations/notifications';
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
    const parsed = notificationsListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, unreadOnly } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: notifications, error, count } = await query;

    if (error) {
      console.error('Notifications list error:', error);
      return errorResponse('Failed to fetch notifications', 500);
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    return successResponse({
      data: notifications,
      unreadCount: unreadCount || 0,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Notifications list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
