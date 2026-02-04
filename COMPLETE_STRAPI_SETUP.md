# Complete Strapi Backend Setup & Configuration Guide

This is the **complete guide** for setting up and configuring your Strapi backend for the SENTIMENT newsletter system with ALTCHA bot protection.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Step 1: Create Strapi Project](#step-1-create-strapi-project)
4. [Step 2: Install Dependencies](#step-2-install-dependencies)
5. [Step 3: Create Collection Type](#step-3-create-collection-type)
6. [Step 4: Create Registration Service](#step-4-create-registration-service)
7. [Step 5: Create Subscriber Controller](#step-5-create-subscriber-controller)
8. [Step 6: Configure Custom Routes](#step-6-configure-custom-routes)
9. [Step 7: Configure Email Plugin](#step-7-configure-email-plugin)
10. [Step 8: Configure CORS & Middleware](#step-8-configure-cors--middleware)
11. [Step 9: Set Environment Variables](#step-9-set-environment-variables)
12. [Step 10: Configure Next.js Frontend](#step-10-configure-nextjs-frontend)
13. [Step 11: Create API Token](#step-11-create-api-token)
14. [Step 12: Test the System](#step-12-test-the-system)
15. [Production Deployment](#production-deployment)
16. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+ or 20+** installed
- ✅ **PostgreSQL 14+** (for production) or SQLite (for development)
- ✅ **SMTP server credentials** (Gmail, SendGrid, Mailgun, etc.)
- ✅ **Terminal/Command line** access
- ✅ Basic understanding of Strapi v5

---

## Quick Start

For experienced users, here's the quick version:

```bash
# 1. Generate ALTCHA secret
openssl rand -hex 32

# 2. Create Strapi project
npx create-strapi@latest newsletter-backend --quickstart

# 3. Install dependencies
cd newsletter-backend
npm install @strapi/plugin-email nodemailer uuid altcha-lib

# 4. Copy all files from this guide (schema, service, controller, routes, config)
# 5. Configure environment variables
# 6. Start Strapi
npm run develop

# 7. Create admin user and API token in browser
# 8. Configure Next.js .env.local with the token
# 9. Test the system
```

---

## Step 1: Create Strapi Project

Create a new Strapi project using the CLI:

### Option A: SQLite (Development Only)

```bash
npx create-strapi@latest newsletter-backend --quickstart
```

This creates a Strapi project with SQLite database (good for development, not recommended for production).

### Option B: PostgreSQL (Recommended for Production)

```bash
npx create-strapi@latest newsletter-backend \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=newsletter_db \
  --dbusername=postgres \
  --dbpassword=your_password
```

Replace `your_password` with your actual PostgreSQL password.

**What this does:**
- Creates a new directory `newsletter-backend`
- Installs Strapi v5 with all dependencies
- Sets up the database connection
- Creates the basic project structure

---

## Step 2: Install Dependencies

Navigate to your Strapi project and install required packages:

```bash
cd newsletter-backend
npm install @strapi/plugin-email nodemailer uuid altcha-lib
```

**What these packages do:**
- `@strapi/plugin-email` - Email sending functionality
- `nodemailer` - SMTP email provider
- `uuid` - Generate unique tokens
- `altcha-lib` - Server-side ALTCHA verification

---

## Step 3: Create Collection Type

Create the subscriber collection type schema.

**File:** `src/api/subscriber/content-types/subscriber/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "subscribers",
  "info": {
    "singularName": "subscriber",
    "pluralName": "subscribers",
    "displayName": "Newsletter Subscriber",
    "description": "Newsletter subscribers with double opt-in and ALTCHA verification"
  },
  "options": {
    "draftAndPublish": false,
    "comment": "Disabled draft/publish as subscribers are either confirmed or not"
  },
  "pluginOptions": {
    "i18n": {
      "localized": false
    }
  },
  "attributes": {
    "email": {
      "type": "email",
      "required": true,
      "unique": true,
      "lowercase": true,
      "private": false
    },
    "token": {
      "type": "string",
      "required": true,
      "unique": true,
      "private": true,
      "configurable": false
    },
    "confirmed": {
      "type": "boolean",
      "default": false,
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "unsubscribed"],
      "default": "active",
      "required": true
    },
    "confirmedAt": {
      "type": "datetime"
    },
    "unsubscribedAt": {
      "type": "datetime"
    },
    "ipAddress": {
      "type": "string",
      "private": true
    },
    "userAgent": {
      "type": "text",
      "private": true
    }
  }
}
```

**Key fields:**
- `email` - Subscriber's email address (unique, required)
- `token` - UUID for confirmation/unsubscribe (private, not exposed via API)
- `confirmed` - Whether email is confirmed (double opt-in)
- `status` - active or unsubscribed
- `confirmedAt` - Timestamp of confirmation
- `unsubscribedAt` - Timestamp of unsubscription
- `ipAddress` - Optional: IP address for logging
- `userAgent` - Optional: User agent for logging

---

## Step 4: Create Registration Service

Create the registration service that handles ALTCHA verification, subscriber creation, and email sending.

**File:** `src/api/subscriber/services/registration.js`

```javascript
'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Registration service for newsletter subscribers
 * Handles ALTCHA verification, subscriber creation, and email sending
 */
module.exports = () => ({
  /**
   * Validate ALTCHA payload using server-side verification
   * @param {string} payload - Base64-encoded ALTCHA payload
   * @returns {Promise<boolean>}
   */
  async validateAltcha(payload) {
    try {
      if (!payload || typeof payload !== 'string' || payload.length < 10) {
        strapi.log.warn('Invalid ALTCHA payload format');
        return false;
      }

      const hmacKey = process.env.ALTCHA_SECRET;
      if (!hmacKey) {
        strapi.log.error('ALTCHA_SECRET environment variable not set');
        return false;
      }

      // Import altcha-lib for server-side verification
      const { verifySolution } = require('altcha-lib');
      
      // Verify the ALTCHA solution with expiration check
      const isValid = await verifySolution(payload, hmacKey, true);
      
      if (!isValid) {
        strapi.log.warn('ALTCHA verification failed');
      }
      
      return isValid;
    } catch (error) {
      strapi.log.error('ALTCHA validation error:', error);
      return false;
    }
  },

  /**
   * Create a new subscriber with unique token
   * @param {string} email - Subscriber email
   * @param {object} metadata - Additional metadata (IP, user agent, etc.)
   * @returns {Promise<object|null>}
   */
  async createSubscriber(email, metadata = {}) {
    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email already exists
      const existing = await strapi.db
        .query('api::subscriber.subscriber')
        .findOne({
          where: { email: normalizedEmail },
        });

      // Silent failure for security (prevents user enumeration)
      if (existing) {
        strapi.log.info(`Attempted duplicate subscription: ${normalizedEmail}`);
        return null;
      }

      // Generate unique token
      const token = uuidv4();

      // Create subscriber
      const subscriber = await strapi.db
        .query('api::subscriber.subscriber')
        .create({
          data: {
            email: normalizedEmail,
            token,
            confirmed: false,
            status: 'active',
            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,
          },
        });

      strapi.log.info(`New subscriber created: ${normalizedEmail}`);
      return subscriber;
    } catch (error) {
      strapi.log.error('Create subscriber error:', error);
      throw error;
    }
  },

  /**
   * Send confirmation email with unique token
   * @param {string} email - Subscriber email
   * @param {string} token - Unique confirmation token
   * @returns {Promise<boolean>}
   */
  async sendConfirmationEmail(email, token) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const confirmUrl = `${frontendUrl}/api/newsletter/confirm?token=${token}`;

      await strapi.plugins['email'].services.email.send({
        to: email,
        from: process.env.EMAIL_FROM || 'newsletter@yourdomain.com',
        replyTo: process.env.EMAIL_REPLY_TO || 'noreply@yourdomain.com',
        subject: 'Bestätigen Sie Ihre Newsletter-Anmeldung - SENTIMENT',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1F35A5; font-size: 32px; font-weight: 900; margin: 20px 0 8px; letter-spacing: -0.5px;">SENTIMENT</h1>
              <p style="color: #8b9094; font-size: 12px; margin: 0 0 20px; padding: 0 20px;">
                Sichere Selbstoffenbarung bei intimer Kommunikation mit Dialogsystemen
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #f2f2f2; margin: 24px 0;">
            <h2 style="color: #000; font-size: 24px; margin: 32px 0 24px;">Newsletter-Anmeldung bestätigen</h2>
            <p style="margin-bottom: 16px;">Vielen Dank für Ihr Interesse an unserem Newsletter!</p>
            <p style="margin-bottom: 16px;">
              Um Ihre Anmeldung abzuschließen und regelmäßig Updates über das SENTIMENT-Projekt zu erhalten, 
              klicken Sie bitte auf den folgenden Button:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${confirmUrl}" style="display: inline-block; padding: 14px 32px; background: #FF5C24; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Anmeldung jetzt bestätigen
              </a>
            </div>
            <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
            <p style="color: #1F35A5; font-size: 14px; word-break: break-all;">${confirmUrl}</p>
            <hr style="border: none; border-top: 1px solid #f2f2f2; margin: 24px 0;">
            <p style="color: #666; font-size: 14px; margin-top: 16px;">
              Falls Sie sich nicht für unseren Newsletter angemeldet haben, können Sie diese E-Mail ignorieren.
            </p>
            <p style="color: #8b9094; font-size: 11px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f2f2f2;">
              SENTIMENT ist ein Forschungsprojekt im Rahmen der Förderrichtlinie "Plattform Privatheit"
            </p>
          </body>
          </html>
        `,
      });

      strapi.log.info(`Confirmation email sent to: ${email}`);
      return true;
    } catch (error) {
      strapi.log.error('Send confirmation email error:', error);
      return false;
    }
  },

  /**
   * Confirm subscription with token
   * @param {string} token - Unique confirmation token
   * @returns {Promise<object|null>}
   */
  async confirmSubscription(token) {
    try {
      // Find subscriber by token
      const subscriber = await strapi.db
        .query('api::subscriber.subscriber')
        .findOne({
          where: { token },
        });

      // Return null if token is invalid or already confirmed
      if (!subscriber) {
        strapi.log.warn(`Invalid token attempted: ${token.substring(0, 8)}...`);
        return null;
      }

      if (subscriber.confirmed) {
        strapi.log.info(`Already confirmed: ${subscriber.email}`);
        return null;
      }

      // Update subscriber as confirmed
      const updated = await strapi.db
        .query('api::subscriber.subscriber')
        .update({
          where: { id: subscriber.id },
          data: {
            confirmed: true,
            confirmedAt: new Date(),
          },
        });

      strapi.log.info(`Subscription confirmed: ${subscriber.email}`);
      return updated;
    } catch (error) {
      strapi.log.error('Confirm subscription error:', error);
      return null;
    }
  },

  /**
   * Unsubscribe user with token
   * @param {string} token - Unique unsubscribe token
   * @returns {Promise<object|null>}
   */
  async unsubscribe(token) {
    try {
      const subscriber = await strapi.db
        .query('api::subscriber.subscriber')
        .findOne({
          where: { token },
        });

      if (!subscriber) {
        strapi.log.warn(`Invalid unsubscribe token: ${token.substring(0, 8)}...`);
        return null;
      }

      // Update status to unsubscribed
      const updated = await strapi.db
        .query('api::subscriber.subscriber')
        .update({
          where: { id: subscriber.id },
          data: {
            status: 'unsubscribed',
            unsubscribedAt: new Date(),
          },
        });

      strapi.log.info(`User unsubscribed: ${subscriber.email}`);
      return updated;
    } catch (error) {
      strapi.log.error('Unsubscribe error:', error);
      return null;
    }
  },

  /**
   * Send goodbye email after unsubscribe
   * @param {string} email - Subscriber email
   * @returns {Promise<boolean>}
   */
  async sendGoodbyeEmail(email) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: email,
        from: process.env.EMAIL_FROM || 'newsletter@yourdomain.com',
        replyTo: process.env.EMAIL_REPLY_TO || 'noreply@yourdomain.com',
        subject: 'Newsletter-Abmeldung bestätigt - SENTIMENT',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1F35A5; font-size: 32px; font-weight: 900; margin: 20px 0 8px; letter-spacing: -0.5px;">SENTIMENT</h1>
              <p style="color: #8b9094; font-size: 12px; margin: 0 0 20px; padding: 0 20px;">
                Sichere Selbstoffenbarung bei intimer Kommunikation mit Dialogsystemen
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #f2f2f2; margin: 24px 0;">
            <h2 style="color: #000; font-size: 24px; margin: 32px 0 24px;">Abmeldung bestätigt</h2>
            <p style="margin-bottom: 16px;">Sie wurden erfolgreich vom SENTIMENT Newsletter abgemeldet.</p>
            <p style="margin-bottom: 16px;">
              Schade, dass Sie keine Updates mehr erhalten möchten! Falls Sie Ihre Meinung ändern, 
              können Sie sich jederzeit wieder auf unserer Website anmelden.
            </p>
            <hr style="border: none; border-top: 1px solid #f2f2f2; margin: 24px 0;">
            <p style="color: #666; font-size: 14px; margin-top: 16px;">
              Falls Sie diese Abmeldung nicht selbst durchgeführt haben, kontaktieren Sie uns bitte umgehend.
            </p>
            <p style="color: #8b9094; font-size: 11px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f2f2f2;">
              SENTIMENT ist ein Forschungsprojekt im Rahmen der Förderrichtlinie "Plattform Privatheit"
            </p>
          </body>
          </html>
        `,
      });

      strapi.log.info(`Goodbye email sent to: ${email}`);
      return true;
    } catch (error) {
      strapi.log.error('Send goodbye email error:', error);
      return false;
    }
  },
});
```

---

## Step 5: Create Subscriber Controller

Create the controller that handles HTTP requests.

**File:** `src/api/subscriber/controllers/subscriber.js`

```javascript
'use strict';

/**
 * Subscriber controller
 * Handles newsletter subscription endpoints
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::subscriber.subscriber',
  ({ strapi }) => ({
    /**
     * Subscribe endpoint - handles new newsletter subscriptions
     * POST /api/subscribers/subscribe
     */
    async subscribe(ctx) {
      try {
        const { email, altcha } = ctx.request.body;

        // Validate input
        if (!email || !altcha) {
          return ctx.badRequest('Email and ALTCHA are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return ctx.badRequest('Invalid email format');
        }

        // Get registration service
        const registrationService = strapi.service(
          'api::subscriber.registration',
        );

        // Validate ALTCHA
        const isValidCaptcha = await registrationService.validateAltcha(altcha);
        if (!isValidCaptcha) {
          strapi.log.warn(`Invalid ALTCHA attempt for email: ${email}`);
          return ctx.badRequest('Invalid ALTCHA verification');
        }

        // Extract metadata
        const metadata = {
          ipAddress: ctx.request.ip || ctx.request.header['x-forwarded-for'] || 'unknown',
          userAgent: ctx.request.header['user-agent'] || 'unknown',
        };

        // Create subscriber
        const subscriber = await registrationService.createSubscriber(
          email,
          metadata,
        );

        // Silent failure if email already exists (security best practice)
        if (!subscriber) {
          return ctx.send({
            success: true,
            message:
              'If your email is not already registered, you will receive a confirmation email shortly.',
          });
        }

        // Send confirmation email
        const emailSent = await registrationService.sendConfirmationEmail(
          email,
          subscriber.token,
        );

        if (!emailSent) {
          strapi.log.error(`Failed to send confirmation email to: ${email}`);
        }

        return ctx.send({
          success: true,
          message:
            'Please check your email to confirm your subscription.',
        });
      } catch (error) {
        strapi.log.error('Subscribe endpoint error:', error);
        return ctx.internalServerError('An error occurred while processing your subscription');
      }
    },

    /**
     * Confirm subscription endpoint
     * PUT /api/subscribers/confirm?token=xxx
     */
    async confirm(ctx) {
      try {
        const { token } = ctx.request.query;

        if (!token) {
          return ctx.badRequest('Token is required');
        }

        const registrationService = strapi.service(
          'api::subscriber.registration',
        );
        const subscriber = await registrationService.confirmSubscription(token);

        if (!subscriber) {
          return ctx.badRequest('Invalid or already confirmed token');
        }

        return ctx.send({
          success: true,
          message: 'Subscription confirmed successfully',
          email: subscriber.email,
        });
      } catch (error) {
        strapi.log.error('Confirm endpoint error:', error);
        return ctx.internalServerError('An error occurred while confirming your subscription');
      }
    },

    /**
     * Unsubscribe endpoint
     * PUT /api/subscribers/unsubscribe?token=xxx
     */
    async unsubscribe(ctx) {
      try {
        const { token } = ctx.request.query;

        if (!token) {
          return ctx.badRequest('Token is required');
        }

        const registrationService = strapi.service(
          'api::subscriber.registration',
        );
        const subscriber = await registrationService.unsubscribe(token);

        if (!subscriber) {
          return ctx.badRequest('Invalid token');
        }

        // Send goodbye email (non-blocking)
        registrationService.sendGoodbyeEmail(subscriber.email).catch((err) => {
          strapi.log.error('Failed to send goodbye email:', err);
        });

        return ctx.send({
          success: true,
          message: 'Unsubscribed successfully',
          email: subscriber.email,
        });
      } catch (error) {
        strapi.log.error('Unsubscribe endpoint error:', error);
        return ctx.internalServerError('An error occurred while unsubscribing');
      }
    },

    /**
     * Export subscribers to CSV (Admin only)
     * GET /api/subscribers/export-csv
     */
    async exportCsv(ctx) {
      try {
        // Check authentication
        if (!ctx.state.user) {
          return ctx.unauthorized('Authentication required');
        }

        // Check if user is admin
        const userRole = ctx.state.user.role?.type || ctx.state.user.role?.name;
        if (userRole !== 'admin' && userRole !== 'super-admin') {
          return ctx.forbidden('Admin access required');
        }

        // Fetch confirmed active subscribers
        const subscribers = await strapi.db
          .query('api::subscriber.subscriber')
          .findMany({
            where: {
              confirmed: true,
              status: 'active',
            },
            select: ['email', 'confirmedAt', 'createdAt'],
            orderBy: { confirmedAt: 'desc' },
          });

        // Generate CSV
        const csvRows = [
          'Email,Confirmed At,Subscribed At',
          ...subscribers.map((s) => {
            const email = s.email || '';
            const confirmedAt = s.confirmedAt
              ? new Date(s.confirmedAt).toISOString()
              : '';
            const createdAt = s.createdAt
              ? new Date(s.createdAt).toISOString()
              : '';
            return `${email},${confirmedAt},${createdAt}`;
          }),
        ];

        const csv = csvRows.join('\n');

        // Set headers for CSV download
        ctx.set('Content-Type', 'text/csv; charset=utf-8');
        ctx.set(
          'Content-Disposition',
          `attachment; filename=subscribers-${new Date().toISOString().split('T')[0]}.csv`,
        );
        
        strapi.log.info(`CSV export by admin: ${ctx.state.user.email}`);
        
        return ctx.send(csv);
      } catch (error) {
        strapi.log.error('Export CSV error:', error);
        return ctx.internalServerError('An error occurred while exporting subscribers');
      }
    },
  }),
);
```

---

## Step 6: Configure Custom Routes

Create custom routes for the newsletter endpoints.

**File:** `src/api/subscriber/routes/custom-routes.js`

```javascript
'use strict';

/**
 * Custom routes for subscriber endpoints
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/subscribers/subscribe',
      handler: 'subscriber.subscribe',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/subscribers/confirm',
      handler: 'subscriber.confirm',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/subscribers/unsubscribe',
      handler: 'subscriber.unsubscribe',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/subscribers/export-csv',
      handler: 'subscriber.exportCsv',
      config: {
        auth: true, // Requires authentication
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

---

## Step 7: Configure Email Plugin

Configure the email plugin to send emails via SMTP.

**File:** `config/plugins.js`

```javascript
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false), // true for 465, false for other ports
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'newsletter@yourdomain.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'noreply@yourdomain.com'),
      },
    },
  },
});
```

---

## Step 8: Configure CORS & Middleware

Configure CORS to allow requests from your Next.js frontend.

**File:** `config/middlewares.js`

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: (ctx) => {
        const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
        const origin = ctx.request.header.origin;
        if (allowedOrigins.includes(origin)) {
          return origin;
        }
        return allowedOrigins[0]; // default to first allowed origin
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## Step 9: Set Environment Variables

Create or update the `.env` file in your Strapi project root:

**File:** `.env`

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337

# Frontend URL (for email links and CORS)
# For multiple origins, separate with commas
FRONTEND_URL=http://localhost:3000

# Database Configuration (PostgreSQL example)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=newsletter_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# Email Configuration
# Gmail example (use App Password, not regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=newsletter@yourdomain.com
EMAIL_REPLY_TO=noreply@yourdomain.com

# SendGrid example (alternative)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USERNAME=apikey
# SMTP_PASSWORD=your_sendgrid_api_key

# ALTCHA Secret (MUST be the same as in Next.js)
# Generate with: openssl rand -hex 32
ALTCHA_SECRET=your_64_character_hex_secret_key_here

# Strapi Secrets (auto-generated during setup, keep these)
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
API_TOKEN_SALT=your_api_token_salt
TRANSFER_TOKEN_SALT=your_transfer_token_salt
APP_KEYS=key1,key2,key3,key4
```

**Important Notes:**

1. **ALTCHA_SECRET**: Generate with `openssl rand -hex 32` and use the SAME value in both Strapi and Next.js
2. **SMTP_PASSWORD**: For Gmail, use an App Password (not your regular password)
3. **DATABASE_PASSWORD**: Your PostgreSQL password
4. **APP_KEYS, JWT secrets**: Auto-generated by Strapi, don't change unless needed

---

## Step 10: Configure Next.js Frontend

Configure the Next.js frontend to connect to Strapi.

**File:** `.env.local` (in your Next.js project root)

```env
# ALTCHA Secret (MUST match Strapi)
ALTCHA_SECRET=your_64_character_hex_secret_from_step_9

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Strapi Configuration
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=get_this_from_strapi_admin_in_step_11

# Optional: Public Strapi URL (for client-side requests)
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Optional: Enable logging
NEXT_PUBLIC_SHOW_LOGGER=false
```

**Important:** You'll get the `STRAPI_API_TOKEN` in the next step after starting Strapi.

---

## Step 11: Create API Token

Now start Strapi and create an API token for the Next.js frontend.

### 1. Start Strapi

```bash
# In your newsletter-backend directory
npm run develop
```

This will:
- Start Strapi on `http://localhost:1337`
- Open your browser automatically
- Prompt you to create an admin account

### 2. Create Admin Account

Fill in:
- First name
- Last name
- Email
- Password (strong password recommended)

### 3. Create API Token

After logging in:

1. Go to **Settings** (⚙️ icon in sidebar)
2. Click **API Tokens** (under Global Settings)
3. Click **Create new API Token**
4. Configure:
   - **Name**: `Newsletter Frontend`
   - **Description**: `API token for Next.js newsletter frontend`
   - **Token duration**: `Unlimited` (or set expiration)
   - **Token type**: `Custom`

5. Set Permissions:
   - Find **Subscriber** in the list
   - Check these permissions:
     - `subscribe` - All (check all: create, read, update, delete)
     - `confirm` - All
     - `unsubscribe` - All
   - Leave `exportCsv` for admin only (don't check)

6. Click **Save**
7. **COPY THE TOKEN** - You'll only see it once!

### 4. Add Token to Next.js

Update your Next.js `.env.local`:

```env
STRAPI_API_TOKEN=paste_your_token_here
```

### 5. Restart Next.js

```bash
# Stop Next.js (Ctrl+C)
# Start again
npm run dev
```

---

## Step 12: Test the System

Now test that everything works together.

### Test 1: Check Strapi is Running

```bash
curl http://localhost:1337/api/subscribers
```

Expected: JSON response (empty array or permission error is fine)

### Test 2: Check Next.js Health

```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "healthy",
  "checks": {
    "altchaSecret": true,
    "strapiUrl": true,
    "strapiToken": true,
    "appUrl": true
  }
}
```

### Test 3: Test ALTCHA Challenge

```bash
curl http://localhost:3000/api/newsletter/challenge
```

Expected: JSON with `algorithm`, `challenge`, `signature`, `salt`

### Test 4: Test Full Subscription Flow

1. Open your browser to `http://localhost:3000/#newsletter`
2. Fill in email address
3. Wait for ALTCHA widget to solve (shows checkmark)
4. Check privacy checkbox
5. Click "Jetzt anmelden" (Subscribe)
6. Check your email for confirmation
7. Click confirmation link
8. Should redirect to success page

### Test 5: Verify in Strapi Admin

1. Go to `http://localhost:1337/admin`
2. Click **Content Manager** (📄 icon)
3. Click **Subscriber**
4. You should see your subscriber with:
   - `confirmed: true`
   - `status: active`
   - `confirmedAt: [timestamp]`

### Test 6: Test Unsubscribe

1. Find the unsubscribe link in the confirmation email
2. Click it
3. Should redirect to unsubscribed page
4. Check email for goodbye message
5. Verify in Strapi: status changed to `unsubscribed`

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Generate production `ALTCHA_SECRET` with `openssl rand -hex 32`
- [ ] Set up production PostgreSQL database
- [ ] Configure production SMTP (SendGrid, Mailgun, etc.)
- [ ] Set all environment variables in production
- [ ] Use HTTPS for both Next.js and Strapi
- [ ] Configure CORS for production domain
- [ ] Create production API token with minimal permissions
- [ ] Enable rate limiting (optional but recommended)
- [ ] Set up monitoring and logging
- [ ] Configure backups for database

### Recommended Hosting

**Strapi:**
- Railway (easiest, includes PostgreSQL)
- Heroku (with PostgreSQL add-on)
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Self-hosted VPS

**Next.js:**
- Vercel (easiest)
- Netlify
- Railway
- Vercel + Custom Domain

### Production Environment Variables

**Next.js (Vercel/Netlify):**
```env
ALTCHA_SECRET=your_production_secret_64_chars
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRAPI_API_URL=https://api.yourdomain.com
STRAPI_API_TOKEN=your_production_token
```

**Strapi (Railway/Heroku):**
```env
ALTCHA_SECRET=same_as_nextjs
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=provided_by_hosting
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=newsletter@yourdomain.com
```

### Security Checklist

- [ ] Use strong `ALTCHA_SECRET` (64+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Restrict CORS to your domain only
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files to git
- [ ] Rotate API tokens periodically
- [ ] Monitor logs for suspicious activity
- [ ] Enable rate limiting in production
- [ ] Set up database backups
- [ ] Use strong admin passwords

---

## Troubleshooting

### Issue: "ALTCHA_SECRET not set" error

**Solution:**
1. Check `.env` file exists in Strapi root
2. Verify `ALTCHA_SECRET=...` line is present
3. Restart Strapi: `npm run develop`
4. Check Strapi logs for errors

### Issue: Emails not sending

**Solutions:**

**For Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use App Password in `SMTP_PASSWORD`

**For SendGrid:**
1. Sign up at sendgrid.com
2. Create API key
3. Use these settings:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=your_sendgrid_api_key
   ```

**General:**
- Check SMTP credentials are correct
- Verify port is correct (587 for TLS, 465 for SSL)
- Check Strapi logs: `npm run develop`
- Test SMTP connection with a simple script

### Issue: CORS errors

**Solution:**
1. Check `FRONTEND_URL` in Strapi `.env` matches Next.js URL
2. Include protocol: `http://localhost:3000` not `localhost:3000`
3. For multiple origins: `FRONTEND_URL=http://localhost:3000,https://yourdomain.com`
4. Restart both Strapi and Next.js
5. Clear browser cache

### Issue: "Invalid token" when confirming

**Possible causes:**
1. Token already used (can only confirm once)
2. Token doesn't exist in database
3. Subscriber already confirmed

**Solution:**
- Check Strapi admin panel
- Look for subscriber with that email
- Check `confirmed` and `status` fields
- Try subscribing with a new email

### Issue: Database connection fails

**Solution:**

**For PostgreSQL:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in `.env`
3. Test connection: `psql -U postgres -d newsletter_db`
4. Check if database exists: `\l` in psql

**For SQLite:**
- Should work out of the box
- Check `.tmp/data.db` file exists
- If corrupted, delete and restart Strapi

### Issue: API returns 403 Forbidden

**Solution:**
1. Check API token is correct in Next.js `.env.local`
2. Verify token permissions in Strapi admin
3. Make sure token hasn't expired
4. Check CORS configuration
5. Try creating a new API token

### Issue: Build fails in production

**Solution:**
1. Check Node.js version matches (18+ or 20+)
2. Install dependencies: `npm install`
3. Build Strapi: `npm run build`
4. Check for missing environment variables
5. Review build logs for specific errors

---

## Additional Resources

- **Strapi Documentation**: https://docs.strapi.io/
- **ALTCHA Documentation**: https://altcha.org/docs/
- **ALTCHA JS Library**: https://github.com/altcha-org/altcha-lib
- **Nodemailer Documentation**: https://nodemailer.com/

---

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Strapi logs: `npm run develop` (watch console output)
3. Check Next.js logs in terminal
4. Test each endpoint individually with curl
5. Verify all environment variables are set correctly
6. Check the GitHub repository for issues

---

**Guide Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** ✅ Production Ready  
**Strapi Version:** 5.x  
**Node.js:** 18+ or 20+

---

## Quick Reference

### Strapi Endpoints

```
POST   /api/subscribers/subscribe      - Create subscription (public)
PUT    /api/subscribers/confirm        - Confirm email (public)
PUT    /api/subscribers/unsubscribe    - Unsubscribe (public)
GET    /api/subscribers/export-csv     - Export CSV (admin only)
```

### Environment Variables Summary

**Both (Next.js & Strapi):**
- `ALTCHA_SECRET` - Must be identical in both

**Next.js only:**
- `NEXT_PUBLIC_APP_URL`
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`

**Strapi only:**
- `FRONTEND_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`
- `EMAIL_FROM`, `EMAIL_REPLY_TO`
- `DATABASE_CLIENT`, `DATABASE_HOST`, etc.

### Testing Commands

```bash
# Health check
curl http://localhost:3000/api/health

# ALTCHA challenge
curl http://localhost:3000/api/newsletter/challenge

# Strapi status
curl http://localhost:1337/api/subscribers
```

### Common Tasks

**Start Development:**
```bash
# Terminal 1 - Strapi
cd newsletter-backend
npm run develop

# Terminal 2 - Next.js
cd sentiment
npm run dev
```

**View Subscribers:**
- Go to http://localhost:1337/admin
- Click Content Manager → Subscriber

**Generate ALTCHA Secret:**
```bash
openssl rand -hex 32
```

---

That's it! You now have a complete, production-ready newsletter system with ALTCHA bot protection, double opt-in, and full GDPR compliance. 🎉
