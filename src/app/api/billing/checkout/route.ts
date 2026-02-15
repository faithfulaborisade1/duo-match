import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkoutSchema } from '@/lib/validations/billing';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-utils';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const PRICE_IDS: Record<string, Record<string, string>> = {
  plus: {
    month: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID!,
    year: process.env.STRIPE_PLUS_YEARLY_PRICE_ID!,
  },
  premium: {
    month: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    year: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
  },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { plan, interval, successUrl, cancelUrl } = parsed.data;

    const priceId = PRICE_IDS[plan]?.[interval];
    if (!priceId) {
      return errorResponse('Invalid plan or interval', 400);
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from('subscriptions')
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: customerId,
            plan: 'free',
            status: 'active',
          },
          { onConflict: 'user_id' }
        );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${appUrl}/settings/billing?success=true`,
      cancel_url: cancelUrl || `${appUrl}/settings/billing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        interval,
      },
    });

    return successResponse({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return errorResponse('Failed to create checkout session', 500);
  }
}
