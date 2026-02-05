import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import ConfirmSubscriptionEmail from '@/emails/confirm-subscription';

/**
 * ALTCHA Payload Verification
 * Verifies the proof-of-work solution from the client
 */
async function verifyAltcha(payload: string): Promise<boolean> {
  try {
    // Validate ALTCHA_SECRET environment variable
    const hmacKey = process.env.ALTCHA_SECRET;

    if (!hmacKey) {
      console.error('ALTCHA_SECRET environment variable is not set');
      return false;
    }

    if (!payload || payload.length < 10) {
      return false;
    }

    // Import verifySolution from altcha-lib for server-side verification
    const { verifySolution } = await import('altcha-lib');

    // Verify the ALTCHA solution with signature and expiration check
    const isValid = await verifySolution(payload, hmacKey, true);

    return isValid;
  } catch (error) {
    console.error('ALTCHA verification error:', error);
    return false;
  }
}

/**
 * Create subscriber in Strapi database
 * GDPR: Data minimization - only stores email and confirmation token
 */
interface Subscriber {
  email: string;
  token: string;
  confirmed: boolean;
  status: 'active' | 'unsubscribed';
}

async function createSubscriber(email: string): Promise<Subscriber | null> {
  try {
    const token = crypto.randomUUID();

    // Call Strapi API to create subscriber
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/api/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            email,
            token,
            confirmed: false, // Requires confirmation (double opt-in)
            status: 'active',
          },
        }),
      },
    );

    if (!response.ok) {
      // Silent failure if email already exists (Security: prevents user enumeration)
      if (response.status === 400 || response.status === 409) {
        return null;
      }
      throw new Error('Failed to create subscriber');
    }

    const data = await response.json();
    console.log('✅ Subscriber erstellt:', data.data.email);

    // Strapi v5 returns data directly (not in attributes)
    if (!data.data) {
      console.error('Unexpected Strapi response format:', data);
      return null;
    }

    // Use the token we generated, as Strapi might not return it (if marked private)
    return {
      email: data.data.email,
      token: data.data.token || token, // Fallback to generated token
      confirmed: data.data.confirmed,
      status: data.data.status,
    };
  } catch (error) {
    console.error('Create subscriber error:', error);
    return null;
  }
}

/**
 * Send double opt-in confirmation email
 * GDPR Compliant: User must explicitly confirm subscription
 */
async function sendConfirmationEmail(
  email: string,
  token: string,
): Promise<boolean> {
  try {
    // Generate confirmation URL with token
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${token}`;

    // Render email template
    const emailHtml = await render(ConfirmSubscriptionEmail({ confirmUrl }));

    // Send email via Strapi email plugin
    const response = await fetch(`${process.env.STRAPI_API_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        to: email,
        subject: 'Bestätigen Sie Ihre Newsletter-Anmeldung - SENTIMENT',
        html: emailHtml,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
}

/**
 * Newsletter subscription endpoint
 * Implements double opt-in and GDPR compliance:
 * - Bot protection (ALTCHA)
 * - Data minimization (only email)
 * - Explicit consent (privacy checkbox)
 * - Double opt-in (email confirmation)
 * - Right to be forgotten (unsubscribe link in every email)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validation = newsletterSubscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, altcha, privacy } = validation.data;

    // Verify privacy policy acceptance (GDPR requirement)
    if (!privacy) {
      return NextResponse.json(
        { error: 'Bitte akzeptieren Sie die Datenschutzerklärung' },
        { status: 400 },
      );
    }

    // Verify ALTCHA solution (bot protection)
    const isValidCaptcha = await verifyAltcha(altcha);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Bot-Verifizierung fehlgeschlagen' },
        { status: 400 },
      );
    }

    // Create subscriber (unconfirmed)
    const subscriber = await createSubscriber(email);

    // Silent failure if email already exists
    // GDPR: Prevents user enumeration attack
    if (!subscriber) {
      return NextResponse.json({
        message:
          'Vielen Dank! Falls die E-Mail-Adresse noch nicht registriert ist, erhalten Sie eine Bestätigungs-E-Mail.',
      });
    }

    // Send double opt-in confirmation email
    await sendConfirmationEmail(email, subscriber.token);

    return NextResponse.json({
      message:
        'Vielen Dank! Bitte überprüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Anmeldung.',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Ein interner Fehler ist aufgetreten' },
      { status: 500 },
    );
  }
}
