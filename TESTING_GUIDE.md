# Newsletter API Testing Guide

This guide explains how to test the newsletter API endpoints.

## Quick Start

### 1. Start the Development Server

```bash
# In the Next.js project directory
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Run the Automated Test Suite

```bash
# Make the script executable (first time only)
chmod +x test-newsletter-api.sh

# Run all tests
./test-newsletter-api.sh

# Or specify a custom base URL
BASE_URL=http://localhost:3000 ./test-newsletter-api.sh
```

## Manual Testing

### Test 1: Health Check

```bash
curl http://localhost:3000/api/health | jq .
```

**Expected Response:**
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

### Test 2: ALTCHA Challenge Generation

```bash
curl http://localhost:3000/api/newsletter/challenge | jq .
```

**Expected Response:**
```json
{
  "algorithm": "SHA-256",
  "challenge": "ae557c9a90148c116369a2b8224912d57c85b6e9472bbfa3599d7ed79b7c30b2",
  "maxnumber": 100000,
  "salt": "f2107ec7b8ad195cdba1f1e2?expires=1770238745&",
  "signature": "89e837c313e29ae9c10c453e85e5b0dd49f7ee0fc2a5c6106b2b4b114ac42e6d"
}
```

### Test 3: Subscribe Endpoint - Input Validation

**Test missing email:**
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"altcha":"test","privacy":true}'
```

**Expected:** 400 Bad Request

**Test invalid email format:**
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","altcha":"test","privacy":true}'
```

**Expected:** 400 Bad Request

**Test missing ALTCHA:**
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","privacy":true}'
```

**Expected:** 400 Bad Request

**Test missing privacy acceptance:**
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","altcha":"test"}'
```

**Expected:** 400 Bad Request

### Test 4: Subscribe with Invalid ALTCHA

```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "altcha":"invalid-payload",
    "privacy":true
  }'
```

**Expected:** 400 Bad Request with "Bot-Verifizierung fehlgeschlagen"

### Test 5: Confirm Endpoint

**Test missing token:**
```bash
curl -L http://localhost:3000/api/newsletter/confirm
```

**Expected:** Redirect to `/newsletter/error?reason=missing-token`

**Test invalid token:**
```bash
curl -L http://localhost:3000/api/newsletter/confirm?token=invalid-token-123
```

**Expected:** Redirect to `/newsletter/error?reason=invalid-token`

### Test 6: Unsubscribe Endpoint

**Test missing token:**
```bash
curl -L http://localhost:3000/api/newsletter/unsubscribe
```

**Expected:** Redirect to `/newsletter/error?reason=missing-token`

**Test invalid token:**
```bash
curl -L http://localhost:3000/api/newsletter/unsubscribe?token=invalid-token-123
```

**Expected:** Redirect to `/newsletter/error?reason=invalid-token`

## Testing with Strapi Backend

To test the complete flow with Strapi:

### 1. Set Up Strapi Backend

Follow the instructions in `STRAPI_BACKEND_SETUP.md` to:
1. Create Strapi project
2. Install dependencies
3. Set up collection types
4. Configure services and controllers
5. Start Strapi: `npm run develop`

### 2. Configure Environment Variables

Ensure both `.env.local` (Next.js) and `.env` (Strapi) have:
- Same `ALTCHA_SECRET`
- Correct URLs
- Valid API tokens
- SMTP credentials

### 3. Test Full Subscription Flow

1. **Get ALTCHA Challenge:**
   ```bash
   curl http://localhost:3000/api/newsletter/challenge | jq . > challenge.json
   ```

2. **Subscribe (with valid ALTCHA):**
   - Open the form: `http://localhost:3000/#newsletter`
   - Enter email address
   - Wait for ALTCHA widget to solve
   - Check privacy checkbox
   - Submit form

3. **Check Email:**
   - Open inbox
   - Find confirmation email from SENTIMENT
   - Verify branded design (logo, colors)
   - Click confirmation link

4. **Verify Confirmation:**
   - Should redirect to `/newsletter/success`
   - Check Strapi admin panel
   - Subscriber should have `confirmed: true`

5. **Test Unsubscribe:**
   - Find unsubscribe link in any email
   - Click unsubscribe link
   - Should redirect to `/newsletter/unsubscribed`
   - Check email for goodbye message
   - Verify branded design

## Email Template Preview

To preview email templates locally:

```bash
# Install React Email CLI globally
npm install -g react-email

# Navigate to project directory
cd /home/runner/work/sentiment/sentiment

# Start email preview server
react-email dev

# Open browser to http://localhost:3000
```

Or use the individual template files:
- `src/emails/confirm-subscription.tsx`
- `src/emails/goodbye.tsx`

## GDPR Compliance Verification

### Double Opt-In Checklist

- [ ] User fills form with privacy checkbox checked
- [ ] Subscriber created with `confirmed: false`
- [ ] Confirmation email sent automatically
- [ ] Email contains unique token link
- [ ] Clicking link updates `confirmed: true`
- [ ] Only confirmed subscribers receive newsletters

### Privacy Features Checklist

- [ ] Privacy policy checkbox is mandatory
- [ ] Privacy policy is linked in form
- [ ] Only email address is collected
- [ ] No tracking cookies or fingerprinting
- [ ] ALTCHA is privacy-first (no external services)
- [ ] Unsubscribe link in every email
- [ ] Unsubscribe is one-click (no login)
- [ ] Goodbye email confirms unsubscription

### Security Features Checklist

- [ ] HTTPS enabled in production
- [ ] ALTCHA challenge has HMAC signature
- [ ] Challenge expires after 5 minutes
- [ ] Server-side ALTCHA verification
- [ ] Input validation with Zod
- [ ] Silent failures (no user enumeration)
- [ ] Unique UUID tokens
- [ ] API token authentication

## Troubleshooting

### Issue: Health check shows unhealthy

**Solution:**
1. Check `.env.local` file exists
2. Verify all environment variables are set:
   - `ALTCHA_SECRET`
   - `STRAPI_API_URL`
   - `STRAPI_API_TOKEN`
   - `NEXT_PUBLIC_APP_URL`
3. Restart Next.js dev server

### Issue: ALTCHA verification always fails

**Solution:**
1. Ensure `ALTCHA_SECRET` is set in `.env.local`
2. Verify secret is 64 characters (hex)
3. Check that altcha-lib is installed: `npm list altcha-lib`
4. Restart dev server after changing .env

### Issue: Emails not sending

**Solution:**
1. Check Strapi is running: `http://localhost:1337`
2. Verify SMTP configuration in Strapi `.env`
3. Check Strapi logs for email errors
4. Test SMTP credentials with simple email script

### Issue: Subscribe always returns 400

**Solution:**
1. Check request body includes all required fields:
   - `email` (valid email format)
   - `altcha` (valid payload)
   - `privacy` (true)
2. Check browser console for validation errors
3. Verify Zod schema in `src/lib/newsletter-schema.ts`

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test health check endpoint
ab -n 1000 -c 10 http://localhost:3000/api/health

# Test challenge generation
ab -n 100 -c 5 http://localhost:3000/api/newsletter/challenge
```

**Expected Results:**
- Health check: <5ms average
- Challenge generation: <10ms average

### Monitoring

Monitor these metrics:
- Response times for all endpoints
- ALTCHA verification success rate
- Email delivery success rate
- Subscription confirmation rate
- Error rates by endpoint

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Test Newsletter API
  run: |
    npm run dev &
    sleep 10
    ./test-newsletter-api.sh
```

## Additional Resources

- [ALTCHA Documentation](https://altcha.org/docs/)
- [GDPR Compliance Guide](./GDPR_COMPLIANCE.md)
- [Strapi Setup Guide](./STRAPI_BACKEND_SETUP.md)
- [API Documentation](./CONFIG_SUMMARY.md)

---

**Last Updated:** February 2026  
**Status:** ✅ All tests passing
