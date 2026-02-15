import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || slug.length > 100) {
      return errorResponse('Invalid game slug', 400);
    }

    const supabase = await createClient();

    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFoundResponse('Game not found');
      }
      return errorResponse('Failed to fetch game', 500);
    }

    return successResponse(game);
  } catch (error) {
    console.error('Game fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
