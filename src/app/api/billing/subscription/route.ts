import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return successResponse({
          plan: 'free',
          status: 'active',
          stripe_customer_id: null,
          stripe_subscription_id: null,
          current_period_start: null,
          current_period_end: null,
        });
      }
      return errorResponse('Failed to fetch subscription', 500);
    }

    return successResponse(subscription);
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
