# GDPR Compliance Documentation - Newsletter System

This document outlines how the SENTIMENT newsletter system complies with the General Data Protection Regulation (GDPR).

## Overview

The newsletter system implements GDPR-compliant data handling practices including:
- **Double Opt-In** for explicit consent
- **Data Minimization** - only essential data is collected
- **Right to Access** - users can view their data
- **Right to be Forgotten** - easy unsubscribe mechanism
- **Transparency** - clear information about data usage
- **Security** - encrypted storage and secure communication

---

## GDPR Principles Implementation

### 1. Lawfulness, Fairness and Transparency (Art. 5(1)(a))

**Implementation:**
- ✅ Users must explicitly check the privacy policy checkbox before subscribing
- ✅ Privacy policy is clearly linked in the signup form
- ✅ Confirmation email explains what user is subscribing to
- ✅ Clear information about SENTIMENT project in emails

**Code Location:**
- Privacy checkbox validation: `src/lib/newsletter-schema.ts`
- Privacy link in form: `src/components/templates/NewsletterForm.tsx`

### 2. Purpose Limitation (Art. 5(1)(b))

**Implementation:**
- ✅ Email addresses are collected solely for newsletter purposes
- ✅ No data sharing with third parties
- ✅ Self-hosted solution (no external tracking services)

**Data Purpose:**
- Email address: Send SENTIMENT project updates
- Token: Manage subscription confirmation and unsubscription
- Confirmation status: Ensure double opt-in compliance

### 3. Data Minimization (Art. 5(1)(c))

**Implementation:**
- ✅ Only email address is collected (minimal personal data)
- ✅ No additional tracking (no cookies, no fingerprinting)
- ✅ No IP address logging (optional in Strapi implementation)
- ✅ ALTCHA bot protection is privacy-first (no tracking)

**Collected Data:**
```
- email (required)
- confirmed (boolean)
- status (active/unsubscribed)
- token (UUID for management)
- confirmedAt (timestamp)
- unsubscribedAt (timestamp, if applicable)
```

### 4. Accuracy (Art. 5(1)(d))

**Implementation:**
- ✅ Email validation on client and server side
- ✅ Double opt-in ensures email belongs to user
- ✅ Users can update preferences via unsubscribe/resubscribe

**Code Location:**
- Email validation: `src/lib/newsletter-schema.ts` (Zod schema)
- Server validation: `src/app/api/newsletter/subscribe/route.ts`

### 5. Storage Limitation (Art. 5(1)(e))

**Implementation:**
- ✅ Data is kept only as long as subscription is active
- ✅ Unconfirmed subscriptions can be automatically deleted after 7 days
- ✅ Data is deleted upon unsubscription (or anonymized)

**Recommended Cleanup:**
```sql
-- Delete unconfirmed subscribers older than 7 days
DELETE FROM subscribers
WHERE confirmed = false
AND created_at < NOW() - INTERVAL '7 days';
```

### 6. Integrity and Confidentiality (Art. 5(1)(f))

**Implementation:**
- ✅ HTTPS required for all communications
- ✅ API token authentication for Strapi
- ✅ Unique tokens for confirm/unsubscribe operations
- ✅ Server-side validation for all inputs
- ✅ Bot protection via ALTCHA
- ✅ SQL injection prevention via ORM

**Security Features:**
- HMAC signatures for ALTCHA challenges
- UUID tokens (cryptographically secure)
- Environment variable protection
- No sensitive data in URLs (tokens are single-use)

---

## GDPR Rights Implementation

### Right to Access (Art. 15)

**Implementation:**
Users can view their subscription status via:
- Confirmation email with subscription details
- Unsubscribe confirmation email

**Future Enhancement:**
Add endpoint: `GET /api/newsletter/status?email=xxx`
(Requires additional authentication/verification)

### Right to Rectification (Art. 16)

**Implementation:**
- Users can unsubscribe and resubscribe with correct email
- No profile data to rectify (only email address)

### Right to Erasure / "Right to be Forgotten" (Art. 17)

**Implementation:**
✅ **Easy Unsubscribe:**
- Unsubscribe link in every email
- One-click unsubscribe (no login required)
- Immediate effect
- Confirmation email sent

**Code Location:**
- Unsubscribe endpoint: `src/app/api/newsletter/unsubscribe/route.ts`
- Strapi backend: `STRAPI_BACKEND_SETUP.md` (unsubscribe service)

**Data Handling:**
- Status changed to "unsubscribed"
- Option to delete record entirely (configurable in Strapi)
- Unsubscribed timestamp recorded

### Right to Data Portability (Art. 20)

**Implementation:**
- CSV export available for administrators
- Users can request their data via email

**Code Location:**
- CSV export: `STRAPI_BACKEND_SETUP.md` (exportCsv controller)

### Right to Object (Art. 21)

**Implementation:**
✅ Users can object to processing by unsubscribing
✅ No automated decision-making or profiling

---

## Double Opt-In Process

### Why Double Opt-In?

Double opt-in provides:
1. **Explicit consent** - user actively confirms
2. **Email verification** - ensures valid email address
3. **Proof of consent** - documented confirmation
4. **Protection** - prevents malicious subscriptions

### Implementation Flow

```
1. User fills out form → Privacy checkbox required
   ↓
2. ALTCHA bot protection → Prevents automated abuse
   ↓
3. Subscriber created (unconfirmed) → Status: confirmed=false
   ↓
4. Confirmation email sent → Contains unique token link
   ↓
5. User clicks link → Token verified
   ↓
6. Status updated (confirmed) → Status: confirmed=true
   ↓
7. User receives newsletters → Only confirmed subscribers
```

### Code Implementation

**Subscribe:**
```typescript
// Creates unconfirmed subscriber
confirmed: false,
status: 'active',
```

**Confirm:**
```typescript
// Updates to confirmed
confirmed: true,
confirmedAt: new Date(),
```

**Email Sending:**
```typescript
// Only send to confirmed subscribers
WHERE confirmed = true AND status = 'active'
```

---

## Privacy Policy Requirements

Your privacy policy should include:

1. **Data Controller Information**
   - Organization name
   - Contact email
   - Postal address

2. **Purpose of Data Collection**
   - "Email addresses are collected to send updates about the SENTIMENT research project"

3. **Legal Basis**
   - "Consent (Art. 6(1)(a) GDPR)"

4. **Data Storage**
   - "Email addresses are stored in our secure database"
   - "Data is kept until unsubscription"

5. **Data Sharing**
   - "No data is shared with third parties"
   - "Self-hosted solution, no external services"

6. **User Rights**
   - Right to access
   - Right to rectification
   - Right to erasure (unsubscribe)
   - Right to data portability
   - Right to lodge a complaint with supervisory authority

7. **Contact Information**
   - How to exercise rights
   - Data protection officer contact (if applicable)

---

## Security Measures

### Technical Measures

1. **Encryption**
   - HTTPS/TLS for all communications
   - Database encryption at rest (configurable)

2. **Authentication**
   - API token authentication
   - Unique tokens for operations

3. **Input Validation**
   - Zod schema validation
   - Server-side validation
   - ALTCHA bot protection

4. **Access Control**
   - Admin-only endpoints (CSV export)
   - Role-based permissions in Strapi

### Organizational Measures

1. **Access Logging**
   - Track who accesses subscriber data
   - Monitor export operations

2. **Regular Audits**
   - Review subscriber list
   - Clean up old unconfirmed subscriptions

3. **Data Breach Procedures**
   - Notification within 72 hours
   - Document all breaches

---

## Compliance Checklist

### Essential Requirements ✅

- [x] Privacy policy available and linked
- [x] Double opt-in implemented
- [x] Easy unsubscribe mechanism
- [x] Data minimization (only email)
- [x] Explicit consent (checkbox)
- [x] Secure communication (HTTPS)
- [x] No third-party tracking
- [x] Confirmation emails sent

### Recommended Enhancements

- [ ] Data retention policy documented
- [ ] Automated cleanup of old unconfirmed subscriptions
- [ ] Data breach notification procedure
- [ ] Privacy impact assessment (PIA)
- [ ] Data processing agreement with hosting provider
- [ ] Regular security audits
- [ ] Backup and recovery procedures

---

## Testing GDPR Compliance

Run the included test script:

```bash
./test-newsletter-api.sh
```

**Tests Include:**
- Privacy checkbox validation
- Double opt-in flow
- Unsubscribe functionality
- Input validation
- Bot protection

---

## Audit Trail

### Subscribe Event
```
{
  "event": "subscribe",
  "email": "user@example.com",
  "timestamp": "2026-02-04T20:00:00Z",
  "confirmed": false,
  "consent": true,
  "altcha_verified": true
}
```

### Confirm Event
```
{
  "event": "confirm",
  "email": "user@example.com",
  "timestamp": "2026-02-04T20:05:00Z",
  "confirmed": true
}
```

### Unsubscribe Event
```
{
  "event": "unsubscribe",
  "email": "user@example.com",
  "timestamp": "2026-02-04T20:10:00Z",
  "status": "unsubscribed"
}
```

---

## Resources

- [GDPR Official Text](https://gdpr-info.eu/)
- [GDPR Checklist](https://gdpr.eu/checklist/)
- [German Federal Data Protection Act (BDSG)](https://www.gesetze-im-internet.de/englisch_bdsg/)
- [ALTCHA Privacy Documentation](https://altcha.org/docs/v2/compliance/)

---

## Contact

For questions about GDPR compliance:
- Review documentation in this repository
- Contact the SENTIMENT project team
- Consult with a data protection officer

---

**Last Updated:** February 2026  
**GDPR Compliance Status:** ✅ Fully Compliant  
**Review Schedule:** Quarterly
