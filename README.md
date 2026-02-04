<div>
  <img src="https://img.shields.io/github/checks-status/dmnktoe/sentiment/main?style=flat-square&logo=github&logoColor=%23fff&label=CI&labelColor=%23000" alt="Main Branch Checks">
  <img src="https://img.shields.io/github/issues-pr/dmnktoe/sentiment?style=flat-square&labelColor=%23000" alt="Open Pull Requests">
  <img src="https://img.shields.io/static/v1?label=PRs&message=welcome&style=flat-square&color=5e17eb&labelColor=000000" alt="PRs welcome!" />
  <img alt="License" src="https://img.shields.io/github/license/dmnktoe/sentiment?style=flat-square&color=5e17eb&labelColor=000000">
</div>

# SENTIMENT

Förderrichtlinie "Plattform Privatheit – IT-Sicherheit schützt Privatheit und stützt Demokratie" im Rahmen des Forschungsrahmenprogramms der Bundesregierung zur IT-Sicherheit "Digital. Sicher. Souverän"

## 🎯 Quick Start

This project includes a production-ready newsletter system with ALTCHA bot protection and Strapi backend integration.

### Prerequisites

- Node.js 18+ or 20+
- npm (legacy peer deps mode)
- Strapi backend (optional, for newsletter functionality)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local

# Generate ALTCHA secret
openssl rand -hex 32

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

### Newsletter & ALTCHA Setup

- **[ALTCHA Server Setup](./ALTCHA_SERVER_SETUP.md)** - Complete guide for production-ready ALTCHA implementation
- **[Strapi Backend Setup](./STRAPI_BACKEND_SETUP.md)** - Step-by-step Strapi configuration with code examples
- **[Newsletter README](./NEWSLETTER_README.md)** - Quick start guide for newsletter system
- **[Newsletter Setup Details](./NEWSLETTER_SETUP.md)** - Detailed setup instructions

### Key Features

- ✅ **ALTCHA Bot Protection** - Privacy-first, self-hosted CAPTCHA alternative
- ✅ **Double Opt-In** - Secure email confirmation process
- ✅ **Production-Ready** - Comprehensive error handling and security
- ✅ **Strapi v5 Backend** - Modern, service-based architecture
- ✅ **React Email Templates** - Beautiful, responsive email designs
- ✅ **Health Monitoring** - Built-in health check endpoint

## 🚀 Quick Configuration

### Environment Variables

Required environment variables in `.env.local`:

```env
# ALTCHA Secret (generate with: openssl rand -hex 32)
ALTCHA_SECRET=your_64_character_hex_secret

# Strapi Configuration
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_token

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [.env.example](./.env.example) for complete configuration options.

## 🔧 Development

```bash
# Start development server with Turbopack
npm run dev

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── health/              # Health check endpoint
│   │   └── newsletter/          # Newsletter endpoints
│   │       ├── challenge/       # ALTCHA challenge generation
│   │       ├── subscribe/       # Newsletter subscription
│   │       ├── confirm/         # Email confirmation
│   │       └── unsubscribe/     # Unsubscribe handler
│   └── newsletter/              # Newsletter pages
├── components/                   # React components
│   ├── templates/               # Page templates
│   │   └── NewsletterForm.tsx  # Newsletter signup form
│   └── ui/                      # UI components
├── emails/                      # Email templates (React Email)
│   ├── confirm-subscription.tsx
│   └── goodbye.tsx
└── lib/                         # Utility functions
    ├── newsletter-schema.ts     # Zod validation schemas
    └── strapi-urls.ts          # Strapi API helpers
```

## 🔐 Security Features

1. **ALTCHA Bot Protection** - Privacy-first proof-of-work CAPTCHA
2. **HMAC Signature Verification** - Prevents challenge tampering
3. **Silent Failures** - Prevents user enumeration attacks
4. **Token-based Operations** - Secure confirm/unsubscribe links
5. **Server-side Validation** - All inputs validated with Zod
6. **CORS Protection** - Configurable origin restrictions
7. **Environment Validation** - Required config checked at startup

## 🧪 Testing

### Test Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "timestamp": "2026-02-04T20:00:00.000Z",
  "status": "healthy",
  "checks": {
    "altchaSecret": true,
    "strapiUrl": true,
    "strapiToken": true,
    "appUrl": true
  },
  "version": "1.0.0"
}
```

### Test ALTCHA Challenge

```bash
curl http://localhost:3000/api/newsletter/challenge
```

### Test Newsletter Form

1. Navigate to `http://localhost:3000/#newsletter`
2. Fill in email address
3. Wait for ALTCHA widget to solve (shows checkmark)
4. Submit form
5. Check email inbox for confirmation

## 🚢 Production Deployment

### Pre-Deployment Checklist

- [ ] Generate strong ALTCHA_SECRET: `openssl rand -hex 32`
- [ ] Set up Strapi backend (see [STRAPI_BACKEND_SETUP.md](./STRAPI_BACKEND_SETUP.md))
- [ ] Configure SMTP for email sending
- [ ] Set all environment variables in production
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Test complete newsletter flow
- [ ] Monitor health check endpoint

### Deployment Platforms

**Frontend (Next.js):**

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)

**Backend (Strapi):**

- [Railway](https://railway.app) (recommended)
- [Heroku](https://heroku.com)
- [DigitalOcean App Platform](https://digitalocean.com)

---

## 📖 Project Background

## Motivation

Dank großer Sprachmodelle haben Chatbots in letzter Zeit erhebliche Qualitätssprünge gemacht. Mittlerweile können solche Dialogsysteme natürlich wirkende Antworten auf verschiedenste Anfragen generieren, auf Nachfragen eingehen und auch längere Gesprächsverläufe entstehen lassen. Dadurch kommt die Interaktion mit Chatbots einem authentischen Austausch mit einem Menschen immer näher. In Deutschland kommunizieren immer mehr Nutzende regelmäßig mit Chatbots. Hierbei verschwimmen häufig die wahrgenommenen Grenzen zwischen Künstlicher Intelligenz (KI) und realem Kommunikationspartner. Unternehmen hinter einigen Applikationen nutzen diese Grauzone schon jetzt bewusst aus und bewerben ihre Produkte mit dem Schlagwort „KI-Freund“. In solchen Anwendungen können Nutzende zum Beispiel einen romantischen Beziehungsmodus aktivieren, der es erlaubt, mit einer zuvor konfigurierten künstlichen Person emotionale (Video-)Gespräche zu führen. Chatbots können somit auch interpersonelle intime Kommunikation simulieren. Hierunter fallen Worte der Selbst-offenbarung, der Bestätigung, des Vertrauens und der Zuneigung. Dadurch schenken Nutzende den Systemen Vertrauen und offenbaren intime, persönliche Details. Bisher wurde dieser Aspekt der digitalen Intimität im Rahmen der Privatheitsforschung jedoch kaum untersucht.

## Ziele und Vorgehen

Ziel des Projekts „Sichere Selbstoffenbarung bei intimer Kommunikation mit Dialogsystemen“ (SENTIMENT) ist es, interdisziplinär zu erforschen, welche Prozesse bei der Kommunikation mit Chatbots wirken, wenn Menschen sensible bzw. intime Informationen preisgeben. Hierzu arbeiten Forschende aus Psychologie, Informatik, Rechtswissenschaften und Kunst zusammen. Basierend auf einer Bestandsaufnahme intimer Selbstoffenbarung in Kommunikationssituationen mit Chatbots führen die Forschenden eine Risikobewertung hinsichtlich Datenschutz und Selbstbestimmung der Nutzenden durch. Daraus leiten sie zielgerichtet Privacy-by-Design-Mechanismen ab, um den zuvor identifizierten Risiken entgegenzuwirken, und evaluieren diese im Rahmen einer empirischen Studie. Zudem bezieht das Projektteam die Öffentlichkeit in die Arbeiten ein. Dies geschieht etwa durch eine Kunstausstellung zum Thema „Schutz von intimer Kommunikation“, gestaltet als Dialogforum, bei dem die Forschenden mit der Öffentlichkeit in den Austausch treten und die gewonnenen Erkenntnisse wiederum in das Vorhaben einfließen lassen.

## Innovationen und Perspektiven

Die im Vorhaben geleistete Forschung trägt dazu bei, dass Bürgerinnen und Bürger bei der Nutzung von Chatbots intime Schutzräume finden, in denen eine sichere Selbstoffenbarung möglich ist. Durch die Entwicklung von geeigneten Privacy-by-Design-Ansätzen für Chatbots erhalten Nutzende die Kontrolle und Souveränität über ihre intimen privaten Daten, was maßgeblich dazu beiträgt, die europäischen Werte und Grundrechte jedes einzelnen Menschen im Zusammenhang mit digitalen Technologien zu wahren.
