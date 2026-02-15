import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyticsSchema } from '@/lib/validations/admin';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return forbiddenResponse('Admin access required');
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = analyticsSchema.safeParse(searchParams);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { startDate, endDate } = parsed.data;

    // Default to last 30 days
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get daily metrics
    let metricsQuery = supabase
      .from('daily_metrics')
      .select('*')
      .gte('date', start.toISOString().split('T')[0])
      .lte('date', end.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const { data: dailyMetrics, error: metricsError } = await metricsQuery;

    if (metricsError) {
      console.error('Daily metrics error:', metricsError);
      return errorResponse('Failed to fetch analytics', 500);
    }

    // Get summary stats
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: totalMatches } = await supabase
      .from('matches')
      .select('id', { count: 'exact', head: true });

    const { count: totalGameSessions } = await supabase
      .from('game_sessions')
      .select('id', { count: 'exact', head: true });

    const { count: totalMessages } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true });

    const { count: pendingReports } = await supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: paidSubscriptions } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .neq('plan', 'free')
      .eq('status', 'active');

    return successResponse({
      summary: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalMatches: totalMatches || 0,
        totalGameSessions: totalGameSessions || 0,
        totalMessages: totalMessages || 0,
        pendingReports: pendingReports || 0,
        paidSubscriptions: paidSubscriptions || 0,
      },
      dailyMetrics: dailyMetrics || [],
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return errorResponse('Internal server error', 500);
  }
}
