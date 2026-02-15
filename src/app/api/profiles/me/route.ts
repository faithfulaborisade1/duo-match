import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProfileSchema } from '@/lib/validations/profiles';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, handleDbError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return errorResponse('Profile not found', 404);
    }

    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return successResponse({
      ...profile,
      stats: stats || null,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Profile me error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const updateData = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return handleDbError(error);
    }

    return successResponse(profile);
  } catch (error) {
    console.error('Profile update error:', error);
    return errorResponse('Internal server error', 500);
  }
}
