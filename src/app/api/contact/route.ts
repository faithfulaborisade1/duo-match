import { NextRequest } from 'next/server';
import { contactSchema } from '@/lib/validations/contact';
import { createdResponse, errorResponse, validationErrorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { name, email, subject, message, category } = parsed.data;

    // In production, this would send an email via Resend or store in a support table
    // For now, we log and return success
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      category,
      timestamp: new Date().toISOString(),
    });

    // If Resend is configured, send an email
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@duomatch.com',
          to: process.env.CONTACT_EMAIL || 'support@duomatch.com',
          subject: `[${category}] ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
          replyTo: email,
        });
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    return createdResponse({
      message: 'Thank you for reaching out! We\'ll get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return errorResponse('Internal server error', 500);
  }
}
