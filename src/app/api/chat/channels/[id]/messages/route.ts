import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { messagesListSchema, sendMessageSchema } from '@/lib/validations/chat';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse, createdResponse, handleDbError } from '@/lib/api-utils';
import { paginationMeta, paginationRange, uuidSchema } from '@/lib/validations/shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success) {
      return errorResponse('Invalid channel ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Verify user is part of the channel
    const { data: channel, error: channelError } = await supabase
      .from('chat_channels')
      .select('id, player1_id, player2_id, status')
      .eq('id', id)
      .single();

    if (channelError) {
      if (channelError.code === 'PGRST116') {
        return notFoundResponse('Chat channel not found');
      }
      return errorResponse('Failed to fetch channel', 500);
    }

    if (channel.player1_id !== user.id && channel.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this chat channel');
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = messagesListSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { page, pageSize, before, after } = parsed.data;
    const { from, to } = paginationRange(page, pageSize);

    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, display_name, avatar_url)
      `, { count: 'exact' })
      .eq('channel_id', id);

    if (before) {
      query = query.lt('created_at', before);
    }

    if (after) {
      query = query.gt('created_at', after);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Messages list error:', error);
      return errorResponse('Failed to fetch messages', 500);
    }

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('channel_id', id)
      .neq('sender_id', user.id)
      .eq('is_read', false);

    return successResponse({
      data: messages,
      pagination: paginationMeta(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Messages list error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success) {
      return errorResponse('Invalid channel ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Verify user is part of the channel
    const { data: channel, error: channelError } = await supabase
      .from('chat_channels')
      .select('id, player1_id, player2_id, status')
      .eq('id', id)
      .single();

    if (channelError) {
      if (channelError.code === 'PGRST116') {
        return notFoundResponse('Chat channel not found');
      }
      return errorResponse('Failed to fetch channel', 500);
    }

    if (channel.player1_id !== user.id && channel.player2_id !== user.id) {
      return forbiddenResponse('You are not part of this chat channel');
    }

    if (channel.status !== 'active') {
      return errorResponse('This chat channel is not active', 400);
    }

    const body = await request.json();
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { content, message_type, metadata } = parsed.data;

    // Create the message
    const { data: message, error: createError } = await supabase
      .from('messages')
      .insert({
        channel_id: id,
        sender_id: user.id,
        content,
        message_type,
        metadata: metadata || {},
        is_read: false,
        is_flagged: false,
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, display_name, avatar_url)
      `)
      .single();

    if (createError) {
      return handleDbError(createError);
    }

    // Update channel's last_message_at
    await supabase
      .from('chat_channels')
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    // Create notification for the other user
    const otherUserId = channel.player1_id === user.id ? channel.player2_id : channel.player1_id;
    await supabase
      .from('notifications')
      .insert({
        user_id: otherUserId,
        type: 'new_message',
        title: 'New message',
        body: `You have a new message`,
        data: { channel_id: id, message_id: message.id },
        is_read: false,
      });

    return createdResponse(message);
  } catch (error) {
    console.error('Send message error:', error);
    return errorResponse('Internal server error', 500);
  }
}
