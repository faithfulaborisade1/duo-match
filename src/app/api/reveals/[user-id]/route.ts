import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';
import { uuidSchema } from '@/lib/validations/shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ 'user-id': string }> }
) {
  try {
    const resolvedParams = await params;
    const targetUserId = resolvedParams['user-id'];
    const idParsed = uuidSchema.safeParse(targetUserId);
    if (!idParsed.success) {
      return errorResponse('Invalid user ID', 400);
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Get reveals from current user to target
    const { data: myReveals, error: myRevealsError } = await supabase
      .from('profile_reveals')
      .select('reveal_level, is_mutual, created_at')
      .eq('revealer_id', user.id)
      .eq('revealed_to_id', targetUserId)
      .order('created_at', { ascending: true });

    if (myRevealsError) {
      return errorResponse('Failed to fetch reveals', 500);
    }

    // Get reveals from target to current user
    const { data: theirReveals, error: theirRevealsError } = await supabase
      .from('profile_reveals')
      .select('reveal_level, is_mutual, created_at')
      .eq('revealer_id', targetUserId)
      .eq('revealed_to_id', user.id)
      .order('created_at', { ascending: true });

    if (theirRevealsError) {
      return errorResponse('Failed to fetch reveals', 500);
    }

    const myRevealLevels = (myReveals || []).map((r) => r.reveal_level);
    const theirRevealLevels = (theirReveals || []).map((r) => r.reveal_level);

    return successResponse({
      my_reveals: myReveals || [],
      their_reveals: theirReveals || [],
      my_current_level: myRevealLevels.length > 0 ? myRevealLevels[myRevealLevels.length - 1] : 'none',
      their_current_level: theirRevealLevels.length > 0 ? theirRevealLevels[theirRevealLevels.length - 1] : 'none',
      mutual_levels: myRevealLevels.filter((l) => theirRevealLevels.includes(l)),
    });
  } catch (error) {
    console.error('Reveal status error:', error);
    return errorResponse('Internal server error', 500);
  }
}
