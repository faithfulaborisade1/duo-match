import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { password } = parsed.data;
    const supabase = await createClient();

    // The user must have a valid session from the reset link
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse('Invalid or expired reset token. Please request a new password reset.');
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse('Internal server error', 500);
  }
}
