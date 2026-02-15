import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is suspended or banned
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', data.user.id)
      .single();

    if (profile?.status === 'banned') {
      await supabase.auth.signOut();
      return errorResponse('Your account has been banned', 403);
    }

    if (profile?.status === 'suspended') {
      await supabase.auth.signOut();
      return errorResponse('Your account is currently suspended', 403);
    }

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', 500);
  }
}
