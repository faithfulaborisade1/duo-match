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
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', userId: user.id })}\n\n`)
      );

      let lastCheck = new Date().toISOString();
      const interval = setInterval(async () => {
        try {
          const { data: newNotifications } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_read', false)
            .gt('created_at', lastCheck)
            .order('created_at', { ascending: false });

          if (newNotifications && newNotifications.length > 0) {
            for (const notification of newNotifications) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'notification', notification })}\n\n`)
              );
            }
          }

          lastCheck = new Date().toISOString();
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        }
      }, 5000);

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
