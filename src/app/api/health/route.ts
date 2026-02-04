import { NextResponse } from 'next/server';

/**
 * Health check endpoint for ALTCHA server
 * Returns the status of the ALTCHA server and configuration
 */
export async function GET() {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {
        altchaSecret: !!process.env.ALTCHA_SECRET,
        strapiUrl: !!process.env.STRAPI_API_URL,
        strapiToken: !!process.env.STRAPI_API_TOKEN,
        appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      },
      version: '1.0.0',
    };

    // Check if all required environment variables are set
    const allChecksPass = Object.values(checks.checks).every((check) => check);

    if (!allChecksPass) {
      return NextResponse.json(
        {
          ...checks,
          status: 'unhealthy',
          message: 'Missing required environment variables',
        },
        { status: 503 },
      );
    }

    return NextResponse.json(checks);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
