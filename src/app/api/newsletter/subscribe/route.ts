import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import ConfirmSubscriptionEmail from '@/emails/confirm-subscription';

// ALTCHA Payload Validierung
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

    // Verify the ALTCHA solution
    const isValid = await verifySolution(payload, hmacKey, true);

    return isValid;
  } catch (error) {
    console.error('ALTCHA verification error:', error);
    return false;
  }
}

// Subscriber-Datenbank Schnittstelle (für Strapi)
interface Subscriber {
  email: string;
  token: string;
  confirmed: boolean;
  status: 'active' | 'unsubscribed';
}

async function createSubscriber(email: string): Promise<Subscriber | null> {
  try {
    const token = crypto.randomUUID();

    // Hier würde die Strapi API aufgerufen werden
    // Beispiel für Strapi v5:
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
            confirmed: false,
            status: 'active',
          },
        }),
      },
    );

    if (!response.ok) {
      // Silent failure bei bereits existierender E-Mail (Security)
      if (response.status === 400 || response.status === 409) {
        return null;
      }
      throw new Error('Failed to create subscriber');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Create subscriber error:', error);
    return null;
  }
}

async function sendConfirmationEmail(
  email: string,
  token: string,
): Promise<boolean> {
  try {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?token=${token}`;

    const emailHtml = await render(ConfirmSubscriptionEmail({ confirmUrl }));

    // Hier würde die E-Mail über Strapi Email Plugin gesendet
    // Oder alternativ über einen E-Mail-Service wie Resend/Sendgrid
    const response = await fetch(`${process.env.STRAPI_API_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        to: email,
        subject: 'Bestätigen Sie Ihre Newsletter-Anmeldung',
        html: emailHtml,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validierung mit Zod
    const validation = newsletterSubscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, altcha } = validation.data;

    // ALTCHA Verification
    const isValidCaptcha = await verifyAltcha(altcha);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Bot-Verifizierung fehlgeschlagen' },
        { status: 400 },
      );
    }

    // Subscriber erstellen
    const subscriber = await createSubscriber(email);

    // Silent failure bei bereits existierender E-Mail (Security Best Practice)
    // Verhindert User-Enumeration
    if (!subscriber) {
      return NextResponse.json({
        message:
          'Vielen Dank! Falls die E-Mail-Adresse noch nicht registriert ist, erhalten Sie eine Bestätigungs-E-Mail.',
      });
    }

    // Bestätigungs-E-Mail senden
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
