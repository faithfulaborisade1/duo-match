import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRevealSchema } from '@/lib/validations/reveals';
import { createdResponse, errorResponse, validationErrorResponse, unauthorizedResponse, handleDbError } from '@/lib/api-utils';

const REVEAL_ORDER = ['bio', 'voice', 'photo'] as const;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = createRevealSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { target_user_id, reveal_level } = parsed.data;

    if (target_user_id === user.id) {
      return errorResponse('Cannot reveal to yourself', 400);
    }

    // Check that the users have a match
    const { data: match } = await supabase
      .from('matches')
      .select('id, status')
      .or(`and(player1_id.eq.${user.id},player2_id.eq.${target_user_id}),and(player1_id.eq.${target_user_id},player2_id.eq.${user.id})`)
      .in('status', ['accepted', 'completed'])
      .maybeSingle();

    if (!match) {
      return errorResponse('You must have an accepted match to reveal your profile', 400);
    }

    // Check current reveal level
    const { data: existingReveal } = await supabase
      .from('profile_reveals')
      .select('reveal_level')
      .eq('revealer_id', user.id)
      .eq('revealed_to_id', target_user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Ensure reveals happen in order
    const currentIndex = existingReveal
      ? REVEAL_ORDER.indexOf(existingReveal.reveal_level as typeof REVEAL_ORDER[number])
      : -1;
    const requestedIndex = REVEAL_ORDER.indexOf(reveal_level);

    if (requestedIndex <= currentIndex) {
      return errorResponse('This reveal level has already been granted', 409);
    }

    if (requestedIndex > currentIndex + 1) {
      const nextLevel = REVEAL_ORDER[currentIndex + 1];
      return errorResponse(`You must reveal ${nextLevel} first`, 400);
    }

    // Check if the other person has also revealed at this level (mutual)
    const { data: otherReveal } = await supabase
      .from('profile_reveals')
      .select('reveal_level')
      .eq('revealer_id', target_user_id)
      .eq('revealed_to_id', user.id)
      .eq('reveal_level', reveal_level)
      .maybeSingle();

    const isMutual = !!otherReveal;

    const { data: reveal, error: createError } = await supabase
      .from('profile_reveals')
      .insert({
        revealer_id: user.id,
        revealed_to_id: target_user_id,
        reveal_level,
        is_mutual: isMutual,
      })
      .select()
      .single();

    if (createError) {
      return handleDbError(createError);
    }

    // If mutual, update the other reveal too
    if (isMutual) {
      await supabase
        .from('profile_reveals')
        .update({ is_mutual: true })
        .eq('revealer_id', target_user_id)
        .eq('revealed_to_id', user.id)
        .eq('reveal_level', reveal_level);
    }

    // Notify the target user
    await supabase
      .from('notifications')
      .insert({
        user_id: target_user_id,
        type: 'profile_reveal',
        title: 'Profile reveal',
        body: `Someone revealed their ${reveal_level} to you!`,
        data: { revealer_id: user.id, reveal_level, is_mutual: isMutual },
        is_read: false,
      });

    return createdResponse({
      ...reveal,
      is_mutual: isMutual,
    });
  } catch (error) {
    console.error('Create reveal error:', error);
    return errorResponse('Internal server error', 500);
  }
}
