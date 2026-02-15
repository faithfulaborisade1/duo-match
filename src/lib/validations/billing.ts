import { z } from 'zod';

export const checkoutSchema = z.object({
  plan: z.enum(['plus', 'premium']),
  interval: z.enum(['month', 'year']).default('month'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
