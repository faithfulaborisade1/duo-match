import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reviewAppealSchema } from '@/lib/validations/admin';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse, handleDbError } from '@/lib/api-utils';
import { uuidSchema } from '@/lib/validations/shared';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success) {
      return errorResponse('Invalid appeal ID', 400);
    }

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
    const parsed = reviewAppealSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { status, reviewer_notes } = parsed.data;

    // Get the appeal
    const { data: appeal, error: fetchError } = await supabase
      .from('appeals')
      .select('*, suspension:user_suspensions(*)')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return notFoundResponse('Appeal not found');
      }
      return errorResponse('Failed to fetch appeal', 500);
    }

    if (appeal.status !== 'pending' && appeal.status !== 'under_review') {
      return errorResponse('This appeal has already been reviewed', 400);
    }

    const now = new Date().toISOString();

    // Update the appeal
    const { data: updatedAppeal, error: updateError } = await supabase
      .from('appeals')
      .update({
        status,
        reviewer_notes,
        reviewed_by: user.id,
        reviewed_at: now,
        updated_at: now,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return handleDbError(updateError);
    }

    // If approved, lift the suspension
    if (status === 'approved' && appeal.suspension_id) {
      await supabase
        .from('user_suspensions')
        .update({
          is_active: false,
          updated_at: now,
        })
        .eq('id', appeal.suspension_id);

      // Reactivate the user
      await supabase
        .from('profiles')
        .update({ status: 'active', updated_at: now })
        .eq('id', appeal.user_id);

      // Notify user
      await supabase
        .from('notifications')
        .insert({
          user_id: appeal.user_id,
          type: 'moderation',
          title: 'Appeal approved',
          body: 'Your appeal has been approved and your account has been reactivated.',
          data: { appeal_id: id },
          is_read: false,
        });
    } else if (status === 'denied') {
      // Notify user
      await supabase
        .from('notifications')
        .insert({
          user_id: appeal.user_id,
          type: 'moderation',
          title: 'Appeal denied',
          body: 'Your appeal has been reviewed and denied.',
          data: { appeal_id: id },
          is_read: false,
        });
    }

    return successResponse(updatedAppeal);
  } catch (error) {
    console.error('Review appeal error:', error);
    return errorResponse('Internal server error', 500);
  }
}
