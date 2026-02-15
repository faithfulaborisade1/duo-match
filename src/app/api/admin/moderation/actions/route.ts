import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moderationActionSchema } from '@/lib/validations/admin';
import { createdResponse, errorResponse, validationErrorResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse, handleDbError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const parsed = moderationActionSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { report_id, action_type, reason, duration_hours, notify_user } = parsed.data;

    // Get the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', report_id)
      .single();

    if (reportError) {
      if (reportError.code === 'PGRST116') {
        return notFoundResponse('Report not found');
      }
      return errorResponse('Failed to fetch report', 500);
    }

    // Create the moderation action
    const { data: action, error: actionError } = await supabase
      .from('moderation_actions')
      .insert({
        report_id,
        moderator_id: user.id,
        action_type,
        reason,
        target_user_id: report.reported_user_id,
      })
      .select()
      .single();

    if (actionError) {
      return handleDbError(actionError);
    }

    // Update report status
    const newStatus = action_type === 'dismiss' ? 'dismissed' : action_type === 'escalate' ? 'escalated' : 'resolved';
    await supabase
      .from('reports')
      .update({
        status: newStatus,
        resolved_at: newStatus === 'resolved' || newStatus === 'dismissed' ? new Date().toISOString() : null,
        resolved_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', report_id);

    // Apply action to the user
    if (action_type === 'suspend' && duration_hours) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + duration_hours);

      await supabase
        .from('user_suspensions')
        .insert({
          user_id: report.reported_user_id,
          suspended_by: user.id,
          reason,
          suspended_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          is_active: true,
        });

      await supabase
        .from('profiles')
        .update({ status: 'suspended', updated_at: new Date().toISOString() })
        .eq('id', report.reported_user_id);
    } else if (action_type === 'ban') {
      await supabase
        .from('profiles')
        .update({ status: 'banned', updated_at: new Date().toISOString() })
        .eq('id', report.reported_user_id);
    }

    // Notify the reported user
    if (notify_user && action_type !== 'dismiss') {
      const notificationMessages: Record<string, string> = {
        warning: 'You have received a warning for violating our community guidelines.',
        mute: 'Your account has been temporarily muted.',
        suspend: `Your account has been suspended for ${duration_hours} hours.`,
        ban: 'Your account has been permanently banned for violating our community guidelines.',
        escalate: 'A report involving your account is being reviewed by our team.',
      };

      await supabase
        .from('notifications')
        .insert({
          user_id: report.reported_user_id,
          type: 'moderation',
          title: 'Moderation notice',
          body: notificationMessages[action_type] || 'A moderation action has been taken on your account.',
          data: { action_type, report_id },
          is_read: false,
        });
    }

    return createdResponse(action);
  } catch (error) {
    console.error('Moderation action error:', error);
    return errorResponse('Internal server error', 500);
  }
}
