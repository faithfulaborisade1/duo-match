import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-utils';
import { uuidSchema } from '@/lib/validations/shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success) {
      return errorResponse('Invalid profile ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Get the reveal level between current user and target
    const { data: reveal } = await supabase
      .from('profile_reveals')
      .select('reveal_level, is_mutual')
      .or(`and(revealer_id.eq.${user.id},revealed_to_id.eq.${id}),and(revealer_id.eq.${id},revealed_to_id.eq.${user.id})`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Base fields always visible
    let selectFields = 'id, display_name, interests, favorite_games, play_style, created_at';

    // Progressive reveal levels
    const revealLevel = reveal?.reveal_level;
    if (revealLevel === 'bio' || revealLevel === 'voice' || revealLevel === 'photo') {
      selectFields += ', bio, gender, location';
    }
    if (revealLevel === 'photo' && reveal?.is_mutual) {
      selectFields += ', avatar_url';
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(selectFields)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFoundResponse('Profile not found');
      }
      return errorResponse('Failed to fetch profile', 500);
    }

    // Get user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('games_played, games_won, total_cooperation_score, average_cooperation_score, current_streak, longest_streak, total_play_time_minutes')
      .eq('user_id', id)
      .single();

    return successResponse({
      ...profile,
      stats: stats || null,
      reveal_level: revealLevel || 'none',
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
