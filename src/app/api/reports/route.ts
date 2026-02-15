import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createReportSchema } from '@/lib/validations/reports';
import { createdResponse, errorResponse, validationErrorResponse, unauthorizedResponse, handleDbError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = createReportSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { reported_user_id, reason, description, evidence_urls, related_match_id, related_session_id, related_message_id } = parsed.data;

    if (reported_user_id === user.id) {
      return errorResponse('You cannot report yourself', 400);
    }

    // Check if user already has a pending report against this user
    const { data: existingReport } = await supabase
      .from('reports')
      .select('id')
      .eq('reporter_id', user.id)
      .eq('reported_user_id', reported_user_id)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingReport) {
      return errorResponse('You already have a pending report against this user', 409);
    }

    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        reported_user_id,
        reason,
        description,
        evidence_urls: evidence_urls || [],
        related_match_id: related_match_id || null,
        related_session_id: related_session_id || null,
        related_message_id: related_message_id || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return handleDbError(error);
    }

    return createdResponse({
      id: report.id,
      status: report.status,
      message: 'Report submitted successfully. Our moderation team will review it.',
    });
  } catch (error) {
    console.error('Create report error:', error);
    return errorResponse('Internal server error', 500);
  }
}
