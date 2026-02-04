# ALTCHA Newsletter - Strapi Backend Production Setup

This guide provides complete step-by-step instructions for setting up a production-ready Strapi backend for the ALTCHA newsletter system.

## Prerequisites

- Node.js 18+ or 20+
- PostgreSQL 14+ (recommended for production) or SQLite (for development)
- Basic understanding of Strapi v5
- SMTP server credentials (for sending emails)

## Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Environment Configuration](#environment-configuration)
4. [API Endpoints](#api-endpoints)
5. [Production Deployment](#production-deployment)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Create Strapi Project

```bash
# Create a new Strapi project (SQLite for development)
npx create-strapi@latest newsletter-backend --quickstart

# OR with PostgreSQL (recommended for production)
npx create-strapi@latest newsletter-backend \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=newsletter_db \
  --dbusername=postgres \
  --dbpassword=your_password
```

### 2. Install Required Dependencies

```bash
cd newsletter-backend
npm install @strapi/plugin-email nodemailer uuid altcha-lib
```

### 3. Create Collection Type

Create the subscriber collection type with the schema provided in this guide (see [Collection Type Schema](#collection-type-schema)).

### 4. Implement Custom Services and Controllers

Copy the service, controller, and routes files provided in this guide.

### 5. Configure Email Plugin

Set up the email plugin with your SMTP provider (see [Email Configuration](#email-configuration)).

### 6. Start Strapi

```bash
npm run develop
```

Access the admin panel at `http://localhost:1337/admin` and create your admin user.

---

## Detailed Setup

### Collection Type Schema

Create the file: `src/api/subscriber/content-types/subscriber/schema.json`

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

### Registration Service

Create the file: `src/api/subscriber/services/registration.js`

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
        subject: 'Bestätigen Sie Ihre Newsletter-Anmeldung',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; margin-bottom: 24px;">Newsletter-Anmeldung bestätigen</h1>
            <p style="margin-bottom: 16px;">Vielen Dank für Ihr Interesse an unserem Newsletter!</p>
            <p style="margin-bottom: 24px;">Bitte klicken Sie auf den folgenden Button, um Ihre Anmeldung zu bestätigen:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${confirmUrl}" style="display: inline-block; padding: 14px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500;">
                Anmeldung bestätigen
              </a>
            </div>
            <p style="margin-top: 32px; font-size: 14px; color: #666;">
              Oder kopieren Sie diesen Link in Ihren Browser:<br>
              <a href="${confirmUrl}" style="color: #0066cc; word-break: break-all;">${confirmUrl}</a>
            </p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999;">
              Sie haben diese E-Mail erhalten, weil jemand Ihre E-Mail-Adresse für unseren Newsletter angemeldet hat.
              Falls Sie sich nicht angemeldet haben, können Sie diese E-Mail ignorieren.
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
        strapi.log.warn(
          `Invalid unsubscribe token: ${token.substring(0, 8)}...`,
        );
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
        subject: 'Newsletter-Abmeldung bestätigt',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; margin-bottom: 24px;">Abmeldung bestätigt</h1>
            <p style="margin-bottom: 16px;">Sie wurden erfolgreich von unserem Newsletter abgemeldet.</p>
            <p style="margin-bottom: 16px;">Wir bedauern, dass Sie keine weiteren Updates von uns erhalten möchten.</p>
            <p style="margin-bottom: 24px;">Falls Sie Ihre Meinung ändern, können Sie sich jederzeit wieder auf unserer Website anmelden.</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999;">
              Vielen Dank für Ihr bisheriges Interesse.
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

### Subscriber Controller

Create the file: `src/api/subscriber/controllers/subscriber.js`

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
          ipAddress:
            ctx.request.ip ||
            ctx.request.header['x-forwarded-for'] ||
            'unknown',
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
          message: 'Please check your email to confirm your subscription.',
        });
      } catch (error) {
        strapi.log.error('Subscribe endpoint error:', error);
        return ctx.internalServerError(
          'An error occurred while processing your subscription',
        );
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
        return ctx.internalServerError(
          'An error occurred while confirming your subscription',
        );
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
        return ctx.internalServerError(
          'An error occurred while exporting subscribers',
        );
      }
    },
  }),
);
```

### Custom Routes

Create the file: `src/api/subscriber/routes/custom-routes.js`

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

## Environment Configuration

### Email Configuration

Create or update `config/plugins.js`:

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

### CORS Configuration

Update `config/middlewares.js`:

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
      origin: env('FRONTEND_URL', 'http://localhost:3000').split(','),
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

### Environment Variables

Create `.env` file in your Strapi project root:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Frontend URL (for email links and CORS)
FRONTEND_URL=http://localhost:3000

# Database (PostgreSQL example)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=newsletter_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=newsletter@yourdomain.com
EMAIL_REPLY_TO=noreply@yourdomain.com

# ALTCHA Secret (generate with: openssl rand -hex 32)
ALTCHA_SECRET=your_64_character_hex_secret_key_here

# Admin JWT Secret (auto-generated during setup)
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
API_TOKEN_SALT=your_api_token_salt
TRANSFER_TOKEN_SALT=your_transfer_token_salt

# App Keys (auto-generated during setup)
APP_KEYS=key1,key2,key3,key4
```

---

## API Endpoints

### Subscribe to Newsletter

**Endpoint:** `POST /api/subscribers/subscribe`

**Request Body:**

```json
{
  "email": "user@example.com",
  "altcha": "base64_encoded_altcha_payload"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Please check your email to confirm your subscription."
}
```

### Confirm Subscription

**Endpoint:** `PUT /api/subscribers/confirm?token=xxx`

**Response (Success):**

```json
{
  "success": true,
  "message": "Subscription confirmed successfully",
  "email": "user@example.com"
}
```

### Unsubscribe

**Endpoint:** `PUT /api/subscribers/unsubscribe?token=xxx`

**Response (Success):**

```json
{
  "success": true,
  "message": "Unsubscribed successfully",
  "email": "user@example.com"
}
```

### Export Subscribers (Admin Only)

**Endpoint:** `GET /api/subscribers/export-csv`

**Headers:**

```
Authorization: Bearer your_admin_jwt_token
```

**Response:** CSV file download

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] PostgreSQL database set up
- [ ] All environment variables configured in production
- [ ] SMTP/Email service credentials configured
- [ ] ALTCHA_SECRET generated (`openssl rand -hex 32`)
- [ ] CORS restricted to production domain
- [ ] HTTPS/SSL certificate installed
- [ ] Rate limiting configured (see below)
- [ ] Backup strategy implemented
- [ ] Monitoring/logging service set up

### Rate Limiting

Install rate limiting middleware:

```bash
npm install koa-ratelimit
```

Create `config/middlewares.js` or update existing:

```javascript
module.exports = [
  // ... other middlewares
  {
    name: 'global::ratelimit',
    config: {
      interval: { min: 5 }, // 5 minutes
      max: 10, // Max 10 requests per interval
      prefixKey: 'newsletter_subscribe',
      whitelist: (ctx) => {
        // Skip rate limiting for specific routes if needed
        return ctx.request.url.startsWith('/admin');
      },
    },
  },
];
```

### Recommended Hosting Providers

**Strapi Backend:**

- Railway (easy deployment, PostgreSQL included)
- Heroku (with PostgreSQL add-on)
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

**Database:**

- Railway PostgreSQL
- Heroku PostgreSQL
- DigitalOcean Managed PostgreSQL
- AWS RDS
- Google Cloud SQL

---

## Testing

### Local Testing

1. Start Strapi:

```bash
npm run develop
```

2. Test subscribe endpoint:

```bash
curl -X POST http://localhost:1337/api/subscribers/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "altcha": "your_altcha_payload_here"
  }'
```

3. Check Strapi logs for confirmation email sent

4. Test confirm endpoint with the token from your database:

```bash
curl -X PUT "http://localhost:1337/api/subscribers/confirm?token=your_token_here"
```

### Integration Testing with Frontend

1. Start both Strapi and Next.js:

```bash
# Terminal 1 - Strapi
cd newsletter-backend
npm run develop

# Terminal 2 - Next.js
cd sentiment
npm run dev
```

2. Navigate to `http://localhost:3000/#newsletter`

3. Fill out the newsletter form and test the complete flow

---

## Troubleshooting

### ALTCHA Verification Fails

**Issue:** ALTCHA verification always returns false

**Solutions:**

1. Verify `ALTCHA_SECRET` is set in both frontend and Strapi backend
2. Ensure the secret matches exactly in both environments
3. Check that the challenge endpoint is working: `/api/newsletter/challenge`
4. Verify the altcha-lib package is installed in Strapi

### Emails Not Sending

**Issue:** Confirmation emails are not being delivered

**Solutions:**

1. Check SMTP credentials in Strapi `.env`
2. Verify SMTP port (587 for TLS, 465 for SSL)
3. For Gmail, use an App Password, not your regular password
4. Check Strapi logs for email errors: `npm run develop` (look for email service logs)
5. Test SMTP connection with a simple script

### CORS Errors

**Issue:** Frontend cannot connect to Strapi API

**Solutions:**

1. Verify `FRONTEND_URL` is set correctly in Strapi `.env`
2. Check `config/middlewares.js` CORS configuration
3. Ensure origin includes protocol (http:// or https://)
4. For multiple origins, use comma-separated values: `http://localhost:3000,https://yourdomain.com`

### Database Connection Issues

**Issue:** Strapi cannot connect to database

**Solutions:**

1. Verify PostgreSQL is running: `pg_isready`
2. Check database credentials in `.env`
3. Ensure database exists: `psql -U postgres -c '\l'`
4. For production, verify SSL settings match your provider's requirements

---

## Security Best Practices

1. **Silent Failures:** Never reveal if an email is already registered
2. **Token Privacy:** Keep `token` field private in schema
3. **Rate Limiting:** Limit subscription attempts per IP
4. **Input Validation:** Validate and sanitize all input
5. **HTTPS Only:** Use HTTPS in production
6. **Environment Variables:** Never commit secrets to version control
7. **CORS Restrictions:** Limit to specific domains in production
8. **Logging:** Log all subscription attempts with IP addresses
9. **Regular Updates:** Keep Strapi and dependencies updated
10. **Monitoring:** Set up error tracking (e.g., Sentry)

---

## Maintenance

### Clean Up Old Unconfirmed Subscribers

Run this query periodically (e.g., via cron job):

```sql
DELETE FROM subscribers
WHERE confirmed = false
AND created_at < NOW() - INTERVAL '7 days';
```

### Monitor Subscription Metrics

Track these metrics:

- Total confirmed subscribers
- Confirmation rate (confirmed / total)
- Unsubscribe rate
- Daily/weekly new subscriptions

---

## Support & Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [ALTCHA Documentation](https://altcha.org/docs/)
- [ALTCHA JS Library](https://github.com/altcha-org/altcha-lib)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Strapi Version:** 5.x  
**Node.js:** 18+ or 20+
