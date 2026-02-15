import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
    }

    // Always return success to prevent email enumeration
    return successResponse({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Internal server error', 500);
  }
}
