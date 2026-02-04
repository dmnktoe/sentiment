# ALTCHA Server - Production-Ready Implementation

This document explains the production-ready ALTCHA server implementation for the newsletter system.

## Overview

ALTCHA (Accessible, Lightweight, Trustworthy CAPTCHA Alternative) is a privacy-first, self-hosted bot protection solution that uses proof-of-work instead of traditional CAPTCHAs.

## Architecture

```
┌─────────────────┐
│  Next.js Client │
│  (Browser)      │
└────────┬────────┘
         │
         │ 1. Request Challenge
         ├──────────────────────────────────┐
         │                                  │
         │                    ┌─────────────▼──────────────┐
         │                    │ GET /api/newsletter/       │
         │                    │     challenge              │
         │                    │                            │
         │  2. Challenge      │ - Creates HMAC challenge   │
         │  ◄─────────────────┤ - Returns signed challenge │
         │                    └────────────────────────────┘
         │
         │ 3. Solve (Client-side PoW)
         │
         │ 4. Submit with Solution
         ├──────────────────────────────────┐
         │                                  │
         │                    ┌─────────────▼──────────────┐
         │                    │ POST /api/newsletter/      │
         │                    │      subscribe             │
         │                    │                            │
         │                    │ - Verifies ALTCHA solution │
         │  5. Success/Error  │ - Validates HMAC signature │
         │  ◄─────────────────┤ - Creates subscriber       │
         │                    │ - Sends confirmation email │
         │                    └────────────────────────────┘
```

## Implementation

### 1. Challenge Generation

**File:** `src/app/api/newsletter/challenge/route.ts`

The challenge endpoint generates a cryptographic challenge using HMAC-SHA-256:

```typescript
import { createChallenge } from 'altcha-lib';

export async function GET() {
  const hmacKey = process.env.ALTCHA_SECRET;

  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 100000, // Proof-of-work difficulty
    algorithm: 'SHA-256',
    expires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  });

  return NextResponse.json(challenge);
}
```

**Response Format:**

```json
{
  "algorithm": "SHA-256",
  "challenge": "base64_encoded_challenge",
  "salt": "random_salt",
  "signature": "hmac_signature"
}
```

### 2. Solution Verification

**File:** `src/app/api/newsletter/subscribe/route.ts`

The subscribe endpoint verifies the ALTCHA solution:

```typescript
import { verifySolution } from 'altcha-lib';

async function verifyAltcha(payload: string): Promise<boolean> {
  const hmacKey = process.env.ALTCHA_SECRET;
  const isValid = await verifySolution(payload, hmacKey, true);
  return isValid;
}
```

### 3. Client-Side Integration

**File:** `src/components/templates/NewsletterForm.tsx`

The ALTCHA widget is integrated using the Web Component:

```tsx
<div
  id='altcha-widget'
  data-altcha-name='altcha'
  data-altcha-challengeurl='/api/newsletter/challenge'
/>
```

The widget automatically:

1. Fetches the challenge from the server
2. Solves the proof-of-work puzzle in the browser
3. Submits the solution with the form

## Environment Variables

### Required Configuration

Create a `.env.local` file in your Next.js project:

```env
# ALTCHA Configuration
ALTCHA_SECRET=your_64_character_hex_secret_key

# Strapi Backend
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate ALTCHA Secret

```bash
# Generate a secure 64-character hex key
openssl rand -hex 32
```

**Important:** Use the same `ALTCHA_SECRET` in both:

- Next.js frontend (for challenge generation)
- Strapi backend (for verification, if implementing ALTCHA there)

## Security Features

### 1. HMAC Signature

Every challenge includes an HMAC signature to prevent tampering:

- **Algorithm:** SHA-256
- **Key:** ALTCHA_SECRET environment variable
- **Protection:** Ensures challenges are genuine and not forged

### 2. Expiration

Challenges expire after 5 minutes to prevent replay attacks:

```typescript
expires: new Date(Date.now() + 5 * 60 * 1000);
```

### 3. Proof-of-Work

Clients must perform computational work to solve the challenge:

- **Difficulty:** maxNumber = 100,000
- **Purpose:** Rate limiting and bot prevention
- **User Impact:** ~1-3 seconds on modern devices

### 4. Server-Side Verification

All solutions are verified server-side:

```typescript
const isValid = await verifySolution(payload, hmacKey, true);
```

The verification checks:

- HMAC signature validity
- Challenge expiration
- Solution correctness

### 5. Silent Failures

The system implements silent failures to prevent user enumeration:

```typescript
// Never reveal if email exists
if (!subscriber) {
  return NextResponse.json({
    message:
      'If your email is not already registered, you will receive a confirmation email.',
  });
}
```

## Testing

### 1. Test Challenge Generation

```bash
curl http://localhost:3000/api/newsletter/challenge
```

**Expected Response:**

```json
{
  "algorithm": "SHA-256",
  "challenge": "dGVzdC1jaGFsbGVuZ2U=",
  "salt": "random-salt-value",
  "signature": "hmac-signature-here",
  "expires": "2026-02-04T21:00:00.000Z"
}
```

### 2. Test Full Flow

1. Open the newsletter form: `http://localhost:3000/#newsletter`
2. Fill in your email
3. Wait for ALTCHA to solve (widget shows checkmark)
4. Submit the form
5. Check console for success message
6. Check email inbox for confirmation

### 3. Test ALTCHA Verification

```bash
# This should fail (invalid payload)
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "altcha": "invalid_payload"
  }'
```

## Production Deployment

### Checklist

- [ ] Generate strong ALTCHA_SECRET: `openssl rand -hex 32`
- [ ] Set ALTCHA_SECRET in production environment
- [ ] Configure STRAPI_API_URL to production URL
- [ ] Set STRAPI_API_TOKEN with minimal permissions
- [ ] Enable HTTPS for all endpoints
- [ ] Set up error logging and monitoring
- [ ] Test challenge generation in production
- [ ] Test full subscription flow end-to-end
- [ ] Monitor challenge generation performance
- [ ] Set up rate limiting (per IP)

### Environment Variables for Production

```env
# Production ALTCHA Configuration
ALTCHA_SECRET=<64-char-hex-generated-with-openssl>

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRAPI_API_URL=https://api.yourdomain.com
STRAPI_API_TOKEN=<your-production-token>

# Optional: Monitoring
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
```

### Vercel Deployment

1. Set environment variables in Vercel dashboard
2. Add `ALTCHA_SECRET` as a secret
3. Deploy and test challenge endpoint

```bash
vercel env add ALTCHA_SECRET production
```

### Performance Considerations

**Challenge Generation:**

- Average: 1-5ms
- Uses native Web Crypto API
- Non-blocking async operation

**Solution Verification:**

- Average: 1-3ms
- Fast HMAC verification
- Minimal server load

**Client-Side Solving:**

- Average: 1-3 seconds
- Depends on maxNumber (difficulty)
- Runs in Web Worker (non-blocking)

## Monitoring & Logging

### What to Monitor

1. **Challenge Generation Rate**
   - Track requests to `/api/newsletter/challenge`
   - Alert on unusual spikes

2. **Verification Success Rate**
   - Track ALTCHA verification pass/fail ratio
   - Alert if fail rate exceeds threshold

3. **Error Rates**
   - ALTCHA_SECRET missing errors
   - Challenge generation failures
   - Verification failures

### Example Logging

```typescript
console.log('[ALTCHA] Challenge generated', {
  timestamp: new Date().toISOString(),
  ip: request.headers.get('x-forwarded-for'),
});

console.log('[ALTCHA] Verification result', {
  timestamp: new Date().toISOString(),
  success: isValid,
  ip: request.headers.get('x-forwarded-for'),
});
```

## Troubleshooting

### Issue: "ALTCHA_SECRET environment variable is not set"

**Cause:** Missing environment variable

**Solution:**

```bash
# Add to .env.local
ALTCHA_SECRET=$(openssl rand -hex 32)
```

### Issue: ALTCHA verification always fails

**Possible Causes:**

1. Mismatched ALTCHA_SECRET between frontend and backend
2. Expired challenge (>5 minutes old)
3. Invalid payload format
4. Clock skew between client and server

**Solutions:**

1. Verify ALTCHA_SECRET matches in all environments
2. Check system time on server
3. Increase challenge expiration if needed
4. Add logging to see actual verification errors

### Issue: ALTCHA widget not loading

**Possible Causes:**

1. Missing ALTCHA script
2. Content Security Policy blocking
3. JavaScript errors

**Solutions:**

1. Verify altcha package is installed: `npm list altcha`
2. Check CSP headers allow the widget
3. Check browser console for errors

### Issue: Slow challenge solving

**Possible Causes:**

1. maxNumber too high
2. Slow client device
3. Heavy page load

**Solutions:**

1. Reduce maxNumber (e.g., 50000 instead of 100000)
2. Test on various devices
3. Load ALTCHA widget asynchronously

## Comparison with Traditional CAPTCHA

| Feature         | ALTCHA         | reCAPTCHA           | hCaptcha            |
| --------------- | -------------- | ------------------- | ------------------- |
| Privacy         | ✅ No tracking | ❌ Google tracking  | ⚠️ Third-party      |
| Self-hosted     | ✅ Yes         | ❌ No               | ❌ No               |
| Accessible      | ✅ WCAG 2.2 AA | ⚠️ Limited          | ⚠️ Limited          |
| Free            | ✅ Yes         | ⚠️ With limits      | ⚠️ With limits      |
| GDPR            | ✅ Compliant   | ⚠️ Requires consent | ⚠️ Requires consent |
| Performance     | ✅ Lightweight | ⚠️ Heavy            | ⚠️ Medium           |
| User Experience | ✅ Seamless    | ❌ Friction         | ❌ Friction         |

## Advanced Configuration

### Custom Challenge Difficulty

Adjust based on your needs:

```typescript
const challenge = await createChallenge({
  hmacKey,
  maxNumber: 50000, // Easier (faster)
  // maxNumber: 200000, // Harder (slower)
  algorithm: 'SHA-256',
  expires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
});
```

### Custom Verification Logic

Add additional checks:

```typescript
async function verifyAltcha(
  payload: string,
  metadata?: { ip?: string; userAgent?: string },
): Promise<boolean> {
  const hmacKey = process.env.ALTCHA_SECRET;

  // Basic verification
  const isValid = await verifySolution(payload, hmacKey, true);

  if (!isValid) {
    return false;
  }

  // Additional checks
  if (metadata?.ip) {
    // Check rate limiting by IP
    const recentAttempts = await getRateLimitCount(metadata.ip);
    if (recentAttempts > 10) {
      console.log(`Rate limit exceeded for IP: ${metadata.ip}`);
      return false;
    }
  }

  return true;
}
```

### Analytics Integration

Track ALTCHA metrics:

```typescript
// Track challenge generation
posthog.capture('altcha_challenge_generated', {
  timestamp: new Date().toISOString(),
});

// Track verification
posthog.capture('altcha_verification', {
  success: isValid,
  timestamp: new Date().toISOString(),
});
```

## FAQ

### Q: Do I need ALTCHA in development?

A: Yes, but you can use a simple secret. In production, use a strong randomly generated secret.

### Q: Can users bypass ALTCHA?

A: No, server-side verification ensures only valid solutions are accepted. The HMAC signature prevents forgery.

### Q: Does ALTCHA work offline?

A: No, it requires server connection to fetch challenges and verify solutions.

### Q: Is ALTCHA accessible?

A: Yes, it meets WCAG 2.2 AA standards and supports screen readers.

### Q: How much does ALTCHA cost?

A: Free and open-source. No third-party service required.

### Q: Can I use ALTCHA with other frameworks?

A: Yes, ALTCHA has integrations for React, Vue, Svelte, Angular, and more.

## Resources

- [ALTCHA Official Website](https://altcha.org)
- [ALTCHA JS Library (GitHub)](https://github.com/altcha-org/altcha-lib)
- [ALTCHA Widget (GitHub)](https://github.com/altcha-org/altcha)
- [ALTCHA Documentation](https://altcha.org/docs/)
- [Backend Setup Guide](./STRAPI_BACKEND_SETUP.md)

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** ✅ Production-Ready
