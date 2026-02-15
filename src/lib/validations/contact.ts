import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
  category: z.enum(['general', 'support', 'feedback', 'partnership', 'press', 'other']).default('general'),
});

export type ContactInput = z.infer<typeof contactSchema>;
