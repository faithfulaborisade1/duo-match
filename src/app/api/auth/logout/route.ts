import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse, noContentResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      return errorResponse(error.message, 500);
    }

    return noContentResponse();
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('Internal server error', 500);
  }
}
