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

    // Get all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .order('category')
      .order('points_value', { ascending: true });

    if (achievementsError) {
      console.error('Achievements error:', achievementsError);
      return errorResponse('Failed to fetch achievements', 500);
    }

    // Get user's unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', user.id);

    if (userAchievementsError) {
      console.error('User achievements error:', userAchievementsError);
      return errorResponse('Failed to fetch user achievements', 500);
    }

    const unlockedMap = new Map(
      (userAchievements || []).map((ua) => [ua.achievement_id, ua.unlocked_at])
    );

    const enrichedAchievements = (achievements || []).map((achievement) => ({
      ...achievement,
      unlocked: unlockedMap.has(achievement.id),
      unlocked_at: unlockedMap.get(achievement.id) || null,
    }));

    const totalPoints = enrichedAchievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + (a.points_value || 0), 0);

    return successResponse({
      achievements: enrichedAchievements,
      totalUnlocked: enrichedAchievements.filter((a) => a.unlocked).length,
      totalAchievements: enrichedAchievements.length,
      totalPoints,
    });
  } catch (error) {
    console.error('Achievements error:', error);
    return errorResponse('Internal server error', 500);
  }
}
