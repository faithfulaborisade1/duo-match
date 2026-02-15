import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markReadSchema } from '@/lib/validations/notifications';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = markReadSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { notification_ids } = parsed.data;

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .in('id', notification_ids);

    if (error) {
      return errorResponse('Failed to mark notifications as read', 500);
    }

    return successResponse({ marked: notification_ids.length });
  } catch (error) {
    console.error('Mark notifications read error:', error);
    return errorResponse('Internal server error', 500);
  }
}
