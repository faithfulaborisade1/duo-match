import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signupSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse, validationErrorResponse, handleDbError, createdResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password, displayName, dateOfBirth } = parsed.data;
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          date_of_birth: dateOfBirth.toISOString().split('T')[0],
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return errorResponse('An account with this email already exists', 409);
      }
      return errorResponse(authError.message, 400);
    }

    if (!authData.user) {
      return errorResponse('Failed to create user', 500);
    }

    // The database trigger will create the profile row, but we also ensure it exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        display_name: displayName,
        date_of_birth: dateOfBirth.toISOString().split('T')[0],
        onboarding_completed: false,
        onboarding_step: 1,
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return createdResponse({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        display_name: displayName,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return errorResponse('Internal server error', 500);
  }
}
