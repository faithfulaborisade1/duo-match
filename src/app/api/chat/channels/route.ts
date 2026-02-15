import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatChannelsListSchema } from '@/lib/validations/chat';
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
    const parsed = chatChannelsListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, status } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('chat_channels')
      .select(`
        *,
        player1:profiles!chat_channels_player1_id_fkey(id, display_name, avatar_url),
        player2:profiles!chat_channels_player2_id_fkey(id, display_name, avatar_url)
      `, { count: 'exact' })
      .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('last_message_at', { ascending: false, nullsFirst: false }).range(from, to);

    const { data: channels, error, count } = await query;

    if (error) {
      console.error('Chat channels list error:', error);
      return errorResponse('Failed to fetch chat channels', 500);
    }

    // Get unread counts for each channel
    const channelsWithUnread = await Promise.all(
      (channels || []).map(async (channel) => {
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('channel_id', channel.id)
          .neq('sender_id', user.id)
          .eq('is_read', false);

        return {
          ...channel,
          unread_count: unreadCount || 0,
        };
      })
    );

    return successResponse({
      data: channelsWithUnread,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Chat channels list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
