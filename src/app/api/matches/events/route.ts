import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', userId: user.id })}\n\n`)
      );

      // Poll for new matches every 10 seconds
      let lastCheck = new Date().toISOString();
      const interval = setInterval(async () => {
        try {
          const { data: newMatches } = await supabase
            .from('matches')
            .select('id, status, compatibility_score, player1_id, player2_id, created_at, updated_at')
            .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
            .gt('updated_at', lastCheck)
            .order('updated_at', { ascending: false });

          if (newMatches && newMatches.length > 0) {
            for (const match of newMatches) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'match_update', match })}\n\n`)
              );
            }
          }

          lastCheck = new Date().toISOString();

          // Send heartbeat
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          // If there's an error, just send heartbeat
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        }
      }, 10000);

      // Clean up on abort
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
