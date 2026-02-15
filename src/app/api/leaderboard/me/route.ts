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

    // Get all leaderboard entries for this user
    const { data: soloEntries, error: soloError } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('period');

    if (soloError) {
      console.error('Solo leaderboard error:', soloError);
      return errorResponse('Failed to fetch leaderboard stats', 500);
    }

    // Get duo entries
    const { data: duoEntries, error: duoError } = await supabase
      .from('duo_leaderboard_entries')
      .select(`
        *,
        player1:profiles!duo_leaderboard_entries_player1_id_fkey(id, display_name, avatar_url),
        player2:profiles!duo_leaderboard_entries_player2_id_fkey(id, display_name, avatar_url)
      `)
      .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
      .order('period');

    if (duoError) {
      console.error('Duo leaderboard error:', duoError);
      return errorResponse('Failed to fetch leaderboard stats', 500);
    }

    // Get user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return successResponse({
      solo: soloEntries || [],
      duo: duoEntries || [],
      stats: stats || null,
    });
  } catch (error) {
    console.error('Leaderboard me error:', error);
    return errorResponse('Internal server error', 500);
  }
}
