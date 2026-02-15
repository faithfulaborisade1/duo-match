import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Get all matches for the user
    const { data: matches, error } = await supabase
      .from('matches')
      .select('status, player1_id, player2_id, player1_decision, player2_decision, compatibility_score')
      .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

    if (error) {
      return errorResponse('Failed to fetch match stats', 500);
    }

    const total = matches?.length || 0;
    const pending = matches?.filter((m) => m.status === 'pending').length || 0;
    const accepted = matches?.filter((m) => m.status === 'accepted').length || 0;
    const rejected = matches?.filter((m) => m.status === 'rejected').length || 0;
    const expired = matches?.filter((m) => m.status === 'expired').length || 0;
    const completed = matches?.filter((m) => m.status === 'completed').length || 0;

    const avgCompatibility = matches && matches.length > 0
      ? matches.reduce((sum, m) => sum + (m.compatibility_score || 0), 0) / matches.length
      : 0;

    return successResponse({
      total,
      pending,
      accepted,
      rejected,
      expired,
      completed,
      averageCompatibilityScore: Math.round(avgCompatibility * 100) / 100,
    });
  } catch (error) {
    console.error('Match stats error:', error);
    return errorResponse('Internal server error', 500);
  }
}
