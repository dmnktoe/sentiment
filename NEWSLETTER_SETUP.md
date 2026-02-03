# Newsletter System - Strapi Backend Setup

## Übersicht

Dieses Dokument beschreibt die vollständige Strapi-Backend-Einrichtung für das Newsletter-System mit Double Opt-In, ALTCHA Bot-Protection und CSV-Export.

---

## 1. Strapi Installation & Initialisierung

### Projekt erstellen

```bash
# In einem separaten Ordner oder als Monorepo-Teil
npx create-strapi-app@latest newsletter-backend --quickstart

# Oder für Production mit PostgreSQL:
npx create-strapi-app@latest newsletter-backend \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=newsletter_db \
  --dbusername=postgres \
  --dbpassword=your_password
```

### Dependencies installieren

```bash
cd newsletter-backend
npm install @strapi/plugin-email
npm install nodemailer  # Oder ein anderer E-Mail-Provider
npm install uuid
```

---

## 2. Collection Type: Subscriber

### Schema Definition

Erstelle eine neue Collection Type `subscriber` mit folgenden Feldern:

**Datei:** `src/api/subscriber/content-types/subscriber/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "subscribers",
  "info": {
    "singularName": "subscriber",
    "pluralName": "subscribers",
    "displayName": "Subscriber",
    "description": "Newsletter subscribers with double opt-in"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "email": {
      "type": "email",
      "required": true,
      "unique": true,
      "lowercase": true
    },
    "token": {
      "type": "string",
      "required": true,
      "unique": true,
      "private": true
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
    }
  }
}
```

---

## 3. Service: Registration Logic

### Service-Datei erstellen

**Datei:** `src/api/subscriber/services/registration.js`

```javascript
'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Registration service
 */

module.exports = () => ({
  /**
   * Validate ALTCHA payload
   */
  async validateAltcha(payload) {
    try {
      // Implementiere ALTCHA Server-Side Verification
      // Siehe: https://altcha.org/docs/api/#server-side-validation

      if (!payload || payload.length < 10) {
        return false;
      }

      // Beispiel mit altcha npm package:
      // const altcha = require('altcha');
      // const isValid = await altcha.verifySolution(
      //   payload,
      //   process.env.ALTCHA_SECRET
      // );

      // Placeholder für Development
      return true;
    } catch (error) {
      strapi.log.error('ALTCHA validation error:', error);
      return false;
    }
  },

  /**
   * Create subscriber with token
   */
  async createSubscriber(email) {
    try {
      // Check if email already exists
      const existing = await strapi.db
        .query('api::subscriber.subscriber')
        .findOne({
          where: { email },
        });

      // Silent failure für Security (verhindert User-Enumeration)
      if (existing) {
        return null;
      }

      // Generate unique token
      const token = uuidv4();

      // Create subscriber
      const subscriber = await strapi.db
        .query('api::subscriber.subscriber')
        .create({
          data: {
            email,
            token,
            confirmed: false,
            status: 'active',
          },
        });

      return subscriber;
    } catch (error) {
      strapi.log.error('Create subscriber error:', error);
      throw error;
    }
  },

  /**
   * Send confirmation email
   */
  async sendConfirmationEmail(email, token) {
    try {
      const confirmUrl = `${process.env.FRONTEND_URL}/api/newsletter/confirm?token=${token}`;

      await strapi.plugins['email'].services.email.send({
        to: email,
        from: process.env.EMAIL_FROM || 'newsletter@yourdomain.com',
        subject: 'Bestätigen Sie Ihre Newsletter-Anmeldung',
        html: `
          <h1>Newsletter-Anmeldung bestätigen</h1>
          <p>Vielen Dank für Ihr Interesse an unserem Newsletter!</p>
          <p>Bitte klicken Sie auf den folgenden Link, um Ihre Anmeldung zu bestätigen:</p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 8px;">
            Anmeldung bestätigen
          </a>
          <p>Oder kopieren Sie diesen Link: ${confirmUrl}</p>
        `,
      });

      return true;
    } catch (error) {
      strapi.log.error('Send email error:', error);
      return false;
    }
  },

  /**
   * Confirm subscription
   */
  async confirmSubscription(token) {
    try {
      const subscriber = await strapi.db
        .query('api::subscriber.subscriber')
        .findOne({
          where: { token },
        });

      if (!subscriber || subscriber.confirmed) {
        return null;
      }

      const updated = await strapi.db
        .query('api::subscriber.subscriber')
        .update({
          where: { id: subscriber.id },
          data: {
            confirmed: true,
            confirmedAt: new Date(),
          },
        });

      return updated;
    } catch (error) {
      strapi.log.error('Confirm subscription error:', error);
      return null;
    }
  },

  /**
   * Unsubscribe user
   */
  async unsubscribe(token) {
    try {
      const subscriber = await strapi.db
        .query('api::subscriber.subscriber')
        .findOne({
          where: { token },
        });

      if (!subscriber) {
        return null;
      }

      const updated = await strapi.db
        .query('api::subscriber.subscriber')
        .update({
          where: { id: subscriber.id },
          data: {
            status: 'unsubscribed',
            unsubscribedAt: new Date(),
          },
        });

      return updated;
    } catch (error) {
      strapi.log.error('Unsubscribe error:', error);
      return null;
    }
  },
});
```

---

## 4. Custom Controller

**Datei:** `src/api/subscriber/controllers/subscriber.js`

```javascript
'use strict';

/**
 * subscriber controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::subscriber.subscriber',
  ({ strapi }) => ({
    /**
     * Subscribe endpoint
     */
    async subscribe(ctx) {
      try {
        const { email, altcha } = ctx.request.body;

        if (!email || !altcha) {
          return ctx.badRequest('Email and ALTCHA are required');
        }

        // Validate ALTCHA
        const registrationService = strapi.service(
          'api::subscriber.registration',
        );
        const isValidCaptcha = await registrationService.validateAltcha(altcha);

        if (!isValidCaptcha) {
          return ctx.badRequest('Invalid ALTCHA');
        }

        // Create subscriber
        const subscriber = await registrationService.createSubscriber(email);

        // Silent failure bei bereits existierender E-Mail
        if (!subscriber) {
          return ctx.send({
            message:
              'If your email is not already registered, you will receive a confirmation email.',
          });
        }

        // Send confirmation email
        await registrationService.sendConfirmationEmail(
          email,
          subscriber.token,
        );

        return ctx.send({
          message: 'Please check your email to confirm your subscription.',
        });
      } catch (error) {
        strapi.log.error('Subscribe error:', error);
        return ctx.internalServerError('An error occurred');
      }
    },

    /**
     * Confirm subscription endpoint
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
          message: 'Subscription confirmed successfully',
        });
      } catch (error) {
        strapi.log.error('Confirm error:', error);
        return ctx.internalServerError('An error occurred');
      }
    },

    /**
     * Unsubscribe endpoint
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

        return ctx.send({
          message: 'Unsubscribed successfully',
          email: subscriber.email,
        });
      } catch (error) {
        strapi.log.error('Unsubscribe error:', error);
        return ctx.internalServerError('An error occurred');
      }
    },

    /**
     * Export CSV (Admin only)
     */
    async exportCsv(ctx) {
      try {
        // Check if user is authenticated and has admin role
        if (!ctx.state.user || ctx.state.user.role?.type !== 'admin') {
          return ctx.forbidden('Admin access required');
        }

        const subscribers = await strapi.db
          .query('api::subscriber.subscriber')
          .findMany({
            where: {
              confirmed: true,
              status: 'active',
            },
            select: ['email', 'confirmedAt'],
          });

        // Generate CSV
        const csv = [
          'Email,Confirmed At',
          ...subscribers.map(
            (s) =>
              `${s.email},${s.confirmedAt ? new Date(s.confirmedAt).toISOString() : ''}`,
          ),
        ].join('\n');

        ctx.set('Content-Type', 'text/csv');
        ctx.set('Content-Disposition', 'attachment; filename=subscribers.csv');
        ctx.send(csv);
      } catch (error) {
        strapi.log.error('Export CSV error:', error);
        return ctx.internalServerError('An error occurred');
      }
    },
  }),
);
```

---

## 5. Custom Routes

**Datei:** `src/api/subscriber/routes/custom-routes.js`

```javascript
'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/subscribers/subscribe',
      handler: 'subscriber.subscribe',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/subscribers/confirm',
      handler: 'subscriber.confirm',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/subscribers/unsubscribe',
      handler: 'subscriber.unsubscribe',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/subscribers/export-csv',
      handler: 'subscriber.exportCsv',
      config: {
        policies: [],
      },
    },
  ],
};
```

---

## 6. E-Mail Plugin Konfiguration

### Nodemailer Provider

**Datei:** `config/plugins.js`

```javascript
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
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

### Environment Variables

**Datei:** `.env`

```env
# Frontend
FRONTEND_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=newsletter@yourdomain.com

# ALTCHA
ALTCHA_SECRET=your_secret_key_here

# API Token für Frontend
API_TOKEN_SALT=your_random_salt_here
```

---

## 7. Security & Permissions

### API Token erstellen

1. Im Strapi Admin Panel: **Settings > API Tokens > Create new API Token**
2. Name: `Newsletter Frontend`
3. Token type: `Custom`
4. Permissions:
   - `subscriber.subscribe` - alle erlauben
   - `subscriber.confirm` - alle erlauben
   - `subscriber.unsubscribe` - alle erlauben
   - `subscriber.exportCsv` - nur für Admins

### CORS Configuration

**Datei:** `config/middlewares.js`

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
      origin: [process.env.FRONTEND_URL],
      credentials: true,
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

## 8. Testing

### Lokales Testing

```bash
# Strapi starten
npm run develop

# Testen der Endpunkte
curl -X POST http://localhost:1337/api/subscribers/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","altcha":"test_payload"}'
```

---

## 9. Production Deployment

### Checklist

- [ ] PostgreSQL Datenbank einrichten
- [ ] Umgebungsvariablen setzen
- [ ] E-Mail-Provider konfigurieren (z.B. SendGrid, Mailgun)
- [ ] ALTCHA Secret generieren: `openssl rand -hex 32`
- [ ] CORS auf Production-Domain beschränken
- [ ] API Token mit minimalen Rechten erstellen
- [ ] Rate Limiting aktivieren
- [ ] HTTPS/SSL einrichten
- [ ] Backup-Strategie implementieren

---

## 10. Monitoring & Maintenance

### Wichtige Metriken

- Anzahl bestätigter Subscriber
- Confirmation Rate (bestätigt / angemeldet)
- Bounce Rate
- Unsubscribe Rate

### Datenbank-Wartung

```sql
-- Alte unbestätigte Subscriber löschen (älter als 7 Tage)
DELETE FROM subscribers
WHERE confirmed = false
AND created_at < NOW() - INTERVAL '7 days';
```

---

## Support & Weitere Ressourcen

- [Strapi Documentation](https://docs.strapi.io/)
- [ALTCHA Documentation](https://altcha.org/docs/)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Version:** 1.0.0
**Letzte Aktualisierung:** Februar 2026
