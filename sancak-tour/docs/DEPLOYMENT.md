# Deployment

## Option A: single VPS / container (works as-is)
```bash
cd sancak-tour && npm ci && npm run build
SITE_URL=https://www.your-domain.com SESSION_SECRET=$(openssl rand -hex 32) \
ADMIN_EMAIL=owner@your-domain.com ADMIN_PASSWORD='long-unique-password' \
DATA_DIR=/var/lib/sancak npm start        # port 3000, put nginx/Caddy with HTTPS in front
```
Back up `DATA_DIR` (store.json + uploads/) daily. Run one instance only (file store).

## Option B: Vercel / serverless / multiple instances
The file store does not persist there. Create a Supabase/PostgreSQL project, run `db/schema.sql`, and implement the exported functions of `lib/store.ts` (`readDb`, `mutateDb`, getters) with a Postgres client; store uploads in Supabase Storage/S3 and point `app/api/admin/upload` + `app/uploads` to it. Set the same environment variables in the host.

## Environment variables
See `.env.example`. Required in production: `SITE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. For emails: `SMTP_*`, `MAIL_FROM`, `MAIL_NOTIFY_TO`. Stripe: `STRIPE_SECRET_KEY` (test key `sk_test_…`), `STRIPE_WEBHOOK_SECRET`; webhook endpoint `https://domain/api/stripe/webhook` event `checkout.session.completed`.

## Search & analytics
Submit `https://domain/sitemap.xml` in Google Search Console (paste the verification code in Admin → Settings). GA4 ID in Settings loads only after cookie opt-in.

## Before launch
Replace demo data · upload licensed photos & logo · lawyer review of legal pages · native-speaker review of translations · test a booking, a bank-transfer email and (test-mode) card payment end-to-end · set up HTTPS and backups.
