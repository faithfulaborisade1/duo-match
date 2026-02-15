import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { preferencesSchema } from '@/lib/validations/preferences';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, handleDbError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: preferences, error } = await supabase
      .from('match_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences yet, return defaults
        return successResponse({
          user_id: user.id,
          min_age: 18,
          max_age: 50,
          preferred_genders: [],
          max_distance_km: null,
          connection_types: ['any'],
          preferred_play_styles: [],
          preferred_game_categories: [],
          deal_breakers: {},
        });
      }
      return errorResponse('Failed to fetch preferences', 500);
    }

    return successResponse(preferences);
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = preferencesSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { data: preferences, error } = await supabase
      .from('match_preferences')
      .upsert(
        {
          user_id: user.id,
          ...parsed.data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      return handleDbError(error);
    }

    return successResponse(preferences);
  } catch (error) {
    console.error('Preferences update error:', error);
    return errorResponse('Internal server error', 500);
  }
}
