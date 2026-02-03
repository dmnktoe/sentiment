# Newsletter System - Quick Start Guide

## Übersicht

Dieses Newsletter-System bietet:

✅ **Double Opt-In** - Sichere Bestätigung der E-Mail-Adressen
✅ **ALTCHA Bot Protection** - Privacy-first Captcha ohne externe Services
✅ **Silent Failures** - Verhindert User-Enumeration
✅ **React Email Templates** - Professionelle E-Mail-Designs
✅ **CSV Export** - Einfacher Export für Admin-User
✅ **Strapi v5 Backend** - Moderne, service-basierte Architektur

---

## Frontend (Next.js) - Bereits implementiert ✓

### Installierte Komponenten

```
src/
├── app/
│   ├── api/newsletter/
│   │   ├── challenge/route.ts       # ALTCHA Challenge
│   │   ├── subscribe/route.ts       # Newsletter-Anmeldung
│   │   ├── confirm/route.ts         # Bestätigung
│   │   └── unsubscribe/route.ts     # Abmeldung
│   └── newsletter/
│       ├── success/page.tsx         # Erfolgsseite
│       ├── error/page.tsx           # Fehlerseite
│       └── unsubscribed/page.tsx    # Abmeldungsbestätigung
├── components/
│   ├── helpers/
│   │   └── AltchaScript.tsx         # ALTCHA Widget Loader
│   ├── layout/
│   │   └── NewsletterCTA.tsx        # Newsletter CTA (aktualisiert)
│   └── templates/
│       └── NewsletterForm.tsx       # Haupt-Formular
├── emails/
│   ├── confirm-subscription.tsx     # DOI E-Mail Template
│   └── goodbye.tsx                  # Abmeldungs-E-Mail
└── lib/
    └── newsletter-schema.ts         # Zod Validation Schema
```

### Environment Variables

Füge zu deiner `.env` hinzu:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=dein_api_token_hier
ALTCHA_SECRET=dein_altcha_secret_hier
```

---

## Backend (Strapi) - Setup erforderlich

### Schritt 1: Strapi Projekt erstellen

```bash
# Option A: Separate Strapi-Installation
npx create-strapi-app@latest newsletter-backend --quickstart

# Option B: Mit PostgreSQL (empfohlen für Production)
npx create-strapi-app@latest newsletter-backend \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=newsletter_db \
  --dbusername=postgres \
  --dbpassword=your_password
```

### Schritt 2: Dependencies installieren

```bash
cd newsletter-backend
npm install @strapi/plugin-email nodemailer uuid
```

### Schritt 3: Collection Type erstellen

Erstelle `src/api/subscriber/content-types/subscriber/schema.json` gemäß [NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md#2-collection-type-subscriber)

### Schritt 4: Service & Controller implementieren

Kopiere die Files aus [NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md):

- `src/api/subscriber/services/registration.js`
- `src/api/subscriber/controllers/subscriber.js`
- `src/api/subscriber/routes/custom-routes.js`

### Schritt 5: E-Mail Plugin konfigurieren

Erstelle `config/plugins.js` für E-Mail-Versand (siehe Setup-Dokument)

### Schritt 6: API Token erstellen

1. Starte Strapi: `npm run develop`
2. Gehe zu: **Settings > API Tokens > Create new API Token**
3. Kopiere den Token in deine `.env`

---

## Testing

### Frontend testen

```bash
# Next.js starten
pnpm dev

# Öffne Browser
http://localhost:3000/#newsletter
```

### Backend testen

```bash
# Strapi starten
cd newsletter-backend
npm run develop

# Test Subscribe Endpoint
curl -X POST http://localhost:1337/api/subscribers/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "altcha": "test_payload"
  }'
```

---

## ALTCHA Integration

### Selbst-gehostet (empfohlen)

1. Generiere Secret: `openssl rand -hex 32`
2. Füge zu `.env` hinzu: `ALTCHA_SECRET=your_secret`
3. Implementiere Server-Side Verification in `src/app/api/newsletter/subscribe/route.ts`

### Widget-basiert

Das ALTCHA Widget wird automatisch geladen via `AltchaScript.tsx`.

Konfiguration im Formular:

```tsx
<div
  id='altcha-widget'
  data-altcha-name='altcha'
  data-altcha-challengeurl='/api/newsletter/challenge'
/>
```

---

## Security Best Practices ✓

✅ **Silent Failures** - Keine Information über existierende E-Mails
✅ **Token-basiert** - UUIDs für Confirm/Unsubscribe
✅ **Server-Side Validation** - ALTCHA & Zod
✅ **Private Token Field** - Nicht über API exponiert
✅ **CORS Restriction** - Nur erlaubte Origins
✅ **Rate Limiting** - Strapi Middleware aktivieren

---

## CSV Export (Admin only)

```bash
# Als authentifizierter Admin
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:1337/api/subscribers/export-csv > subscribers.csv
```

---

## Production Deployment

### Checklist

- [ ] PostgreSQL Datenbank einrichten
- [ ] Umgebungsvariablen in Production setzen
- [ ] SMTP/E-Mail-Service konfigurieren (SendGrid, Mailgun, etc.)
- [ ] ALTCHA Secret generieren
- [ ] CORS auf Production-Domain beschränken
- [ ] Rate Limiting aktivieren
- [ ] HTTPS/SSL einrichten
- [ ] Monitoring Setup (z.B. Sentry)

### Empfohlene Hosting-Provider

**Strapi Backend:**

- Railway
- Heroku
- DigitalOcean App Platform
- AWS/GCP

**Next.js Frontend:**

- Vercel
- Netlify
- Railway

---

## Dokumentation

📚 **Ausführliche Setup-Anleitung:** [NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md)
📧 **E-Mail Templates:** `src/emails/`
🔒 **Security:** Siehe Abschnitt 7 in NEWSLETTER_SETUP.md

---

## Support & Issues

Bei Fragen oder Problemen:

1. Prüfe [NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md)
2. Überprüfe Logs in Strapi & Next.js
3. Teste Endpunkte mit curl/Postman

---

**Version:** 1.0.0
**Stand:** Februar 2026
