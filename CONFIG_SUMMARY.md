# ALTCHA & Strapi Setup - Configuration Summary

This document provides a quick reference for configuring the ALTCHA newsletter system with Strapi backend.

## ✅ What Has Been Implemented

### Frontend (Next.js) - ✅ Complete

1. **ALTCHA Challenge Generation** (`/api/newsletter/challenge`)
   - Proper HMAC-SHA256 signature
   - 5-minute expiration
   - Random salt generation

2. **ALTCHA Verification** (`/api/newsletter/subscribe`)
   - Server-side verification using altcha-lib
   - Input validation with Zod
   - Silent failures for security

3. **Health Check** (`/api/health`)
   - Environment variable validation
   - System status monitoring

4. **Documentation**
   - Complete ALTCHA setup guide
   - Strapi backend setup guide
   - Environment variable documentation

### Backend (Strapi) - 📋 Ready to Deploy

Complete production-ready code provided in `STRAPI_BACKEND_SETUP.md`:

- Collection type schema
- Registration service with ALTCHA verification
- Controller with all endpoints
- Custom routes configuration
- Email plugin setup
- CORS and middleware configuration

## 🚀 Quick Start Guide

### Step 1: Generate ALTCHA Secret

```bash
openssl rand -hex 32
```

Save this secret - you'll need it in both Next.js and Strapi.

### Step 2: Configure Next.js Environment

Create `.env.local`:

```env
# Required
ALTCHA_SECRET=<your-64-char-hex-from-step-1>
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=<get-from-strapi-after-setup>

# Optional (for development)
NEXT_PUBLIC_SHOW_LOGGER=false
```

### Step 3: Set Up Strapi Backend

Follow the detailed guide in `STRAPI_BACKEND_SETUP.md`:

1. Create Strapi project
2. Install dependencies (altcha-lib, nodemailer, uuid)
3. Create subscriber collection type
4. Add registration service
5. Add subscriber controller
6. Configure custom routes
7. Set up email plugin
8. Configure CORS

### Step 4: Configure Strapi Environment

Create Strapi `.env`:

```env
# Same ALTCHA secret as Next.js
ALTCHA_SECRET=<same-secret-as-nextjs>

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=newsletter@yourdomain.com

# Database (optional - defaults to SQLite)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=newsletter_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
```

### Step 5: Start Both Services

```bash
# Terminal 1 - Next.js
npm run dev

# Terminal 2 - Strapi
cd newsletter-backend
npm run develop
```

### Step 6: Create Strapi API Token

1. Open Strapi admin: `http://localhost:1337/admin`
2. Create admin account
3. Go to Settings > API Tokens > Create new API Token
4. Set permissions:
   - `subscriber.subscribe` - Public access
   - `subscriber.confirm` - Public access
   - `subscriber.unsubscribe` - Public access
5. Copy token to Next.js `.env.local` as `STRAPI_API_TOKEN`

### Step 7: Test the System

1. **Test Health Check:**

   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected: `{"status":"healthy",...}`

2. **Test Challenge Generation:**

   ```bash
   curl http://localhost:3000/api/newsletter/challenge
   ```

   Expected: JSON with challenge, signature, etc.

3. **Test Newsletter Form:**
   - Open `http://localhost:3000/#newsletter`
   - Fill in email
   - Wait for ALTCHA to solve
   - Submit form
   - Check email for confirmation

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Newsletter Form (React)                       │  │
│  │  - Email input                                        │  │
│  │  - ALTCHA widget (auto-solving)                      │  │
│  │  - Privacy checkbox                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬────────────────────────────────┬─────────────┘
               │                                 │
     1. Get Challenge                  3. Submit with Solution
               │                                 │
               ▼                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                Next.js Frontend (Port 3000)                  │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  /api/newsletter/    │      │  /api/newsletter/    │    │
│  │  challenge           │      │  subscribe           │    │
│  │                      │      │                      │    │
│  │  - Generate HMAC     │      │  - Verify ALTCHA     │    │
│  │  - Return challenge  │      │  - Validate input    │    │
│  └──────────────────────┘      │  - Forward to Strapi │    │
│                                 └──────────┬───────────┘    │
└────────────────────────────────────────────┼────────────────┘
                                              │
                                    4. Create Subscriber
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Strapi Backend (Port 1337)                    │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  Registration        │      │  Email Plugin        │    │
│  │  Service             │      │                      │    │
│  │  - Verify ALTCHA     │      │  - Send confirmation │    │
│  │  - Create subscriber │─────▶│  - Send goodbye      │    │
│  │  - Generate token    │      │                      │    │
│  └──────────────────────┘      └──────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL / SQLite Database                        │  │
│  │  - Subscribers table                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Security Features

1. **ALTCHA Bot Protection**
   - Privacy-first (no tracking/cookies)
   - Proof-of-work challenge
   - HMAC signature verification

2. **Double Opt-In**
   - Email confirmation required
   - Unique token per subscriber
   - Token-based unsubscribe

3. **Security Best Practices**
   - Silent failures (no user enumeration)
   - Server-side validation
   - Input sanitization with Zod
   - CORS protection
   - Environment variable validation

## 📝 Environment Variables Reference

### Next.js (.env.local)

| Variable                     | Required | Description                  | Example                 |
| ---------------------------- | -------- | ---------------------------- | ----------------------- |
| `ALTCHA_SECRET`              | ✅       | HMAC secret key (64 chars)   | `openssl rand -hex 32`  |
| `NEXT_PUBLIC_APP_URL`        | ✅       | Public app URL               | `http://localhost:3000` |
| `STRAPI_API_URL`             | ✅       | Strapi backend URL           | `http://localhost:1337` |
| `STRAPI_API_TOKEN`           | ✅       | Strapi API token             | Get from Strapi admin   |
| `NEXT_PUBLIC_STRAPI_API_URL` | ⚠️       | Public Strapi URL (optional) | `http://localhost:1337` |
| `NEXT_PUBLIC_SHOW_LOGGER`    | ❌       | Enable logging               | `false`                 |

### Strapi (.env)

| Variable         | Required | Description      | Example                 |
| ---------------- | -------- | ---------------- | ----------------------- |
| `ALTCHA_SECRET`  | ✅       | Same as Next.js  | Same secret             |
| `FRONTEND_URL`   | ✅       | Next.js URL      | `http://localhost:3000` |
| `SMTP_HOST`      | ✅       | SMTP server      | `smtp.gmail.com`        |
| `SMTP_PORT`      | ✅       | SMTP port        | `587`                   |
| `SMTP_USERNAME`  | ✅       | Email username   | `you@gmail.com`         |
| `SMTP_PASSWORD`  | ✅       | Email password   | Use app password        |
| `EMAIL_FROM`     | ✅       | From address     | `newsletter@domain.com` |
| `EMAIL_REPLY_TO` | ❌       | Reply-to address | `noreply@domain.com`    |

## 🎯 API Endpoints

### Health Check

```bash
GET http://localhost:3000/api/health
```

### Generate Challenge

```bash
GET http://localhost:3000/api/newsletter/challenge
```

### Subscribe

```bash
POST http://localhost:3000/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "altcha": "base64_payload"
}
```

### Confirm (via email link)

```bash
GET http://localhost:3000/api/newsletter/confirm?token=xxx
```

### Unsubscribe (via email link)

```bash
GET http://localhost:3000/api/newsletter/unsubscribe?token=xxx
```

## 🚀 Production Deployment

### Checklist

Frontend (Next.js):

- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables in platform
- [ ] Use `openssl rand -hex 32` for production secret
- [ ] Configure custom domain
- [ ] Enable HTTPS

Backend (Strapi):

- [ ] Deploy to Railway/Heroku/DigitalOcean
- [ ] Use PostgreSQL (not SQLite)
- [ ] Configure SMTP credentials (Gmail/SendGrid/Mailgun)
- [ ] Set same ALTCHA_SECRET as frontend
- [ ] Configure CORS for production domain
- [ ] Create production API token
- [ ] Enable HTTPS

### Production Environment Variables

**Next.js (Vercel/Netlify):**

```env
ALTCHA_SECRET=<production-secret-64-chars>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRAPI_API_URL=https://api.yourdomain.com
STRAPI_API_TOKEN=<production-token>
```

**Strapi (Railway/Heroku):**

```env
ALTCHA_SECRET=<same-as-frontend>
FRONTEND_URL=https://yourdomain.com
DATABASE_CLIENT=postgres
DATABASE_URL=<provided-by-hosting>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=<sendgrid-api-key>
EMAIL_FROM=newsletter@yourdomain.com
```

## 📚 Documentation Files

- **[ALTCHA_SERVER_SETUP.md](./ALTCHA_SERVER_SETUP.md)** - Detailed ALTCHA implementation guide
- **[STRAPI_BACKEND_SETUP.md](./STRAPI_BACKEND_SETUP.md)** - Complete Strapi setup with code
- **[NEWSLETTER_README.md](./NEWSLETTER_README.md)** - Quick overview
- **[NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md)** - Detailed setup guide
- **[README.md](./README.md)** - Main project documentation

## ❓ Troubleshooting

### ALTCHA verification fails

- Ensure `ALTCHA_SECRET` is identical in both Next.js and Strapi
- Check that secret is 64 characters (32 bytes hex)
- Verify challenge hasn't expired (5 minutes)

### Emails not sending

- Check SMTP credentials
- For Gmail, use App Password not regular password
- Verify port (587 for TLS, 465 for SSL)
- Check Strapi logs for email errors

### CORS errors

- Verify `FRONTEND_URL` in Strapi matches Next.js URL
- Check CORS configuration in `config/middlewares.js`
- Ensure protocol is included (http:// or https://)

### Health check shows unhealthy

- Verify all required environment variables are set
- Check `.env.local` file exists and is loaded
- Restart Next.js server after changing .env

## 🤝 Support

For issues or questions:

1. Check the detailed guides in the documentation files
2. Review the troubleshooting section
3. Check Strapi logs: `npm run develop` in Strapi directory
4. Check Next.js logs in terminal

---

**Status:** ✅ Production Ready  
**Last Updated:** February 2026  
**Version:** 1.0.0
