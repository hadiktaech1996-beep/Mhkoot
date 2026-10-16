# Sancak Tour: multilingual travel website

Next.js 14 (App Router) · TypeScript · Tailwind CSS · 4 languages (AR with full RTL, TR, EN, DE) · admin dashboard · booking & request workflows.

> **Honest status.** This is a working, demonstrable codebase, **not yet a live commercial service.**
> All tours, prices, accommodation, vehicles, blog articles and reviews are **clearly labelled demonstration data**.
> Imagery is original illustrated artwork until you upload licensed photographs.
> Payments (Stripe test mode only), email (needs SMTP), PayPal (adapter not connected), Instagram feed (needs API access) and availability sync are **not operational until you connect and test them** (see `docs/OWNER-SETUP.md`).
> Legal pages are draft templates and must be reviewed by a lawyer. No company registration, licence or insurance details have been invented.

## Quick start
```bash
cd sancak-tour
cp .env.example .env.local     # set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD (>=12 chars)
npm install
npm run dev                    # http://localhost:3000  → redirects to /en
```
Admin: `http://localhost:3000/admin` (in dev without env vars a clearly-logged dev-only owner account is created; **production refuses to start login without ADMIN_EMAIL/ADMIN_PASSWORD**).

## What is included
| Area | Where |
|---|---|
| Localised routes `/ar /tr /en /de`, hreflang, canonicals, sitemap, robots, JSON-LD | `app/[lang]`, `lib/seo.ts`, `app/sitemap.ts` |
| Dictionaries (≈450 strings × 4) + admin-editable overrides | `lib/i18n/*`, Admin → Translations |
| Homepage (14 sections, toggleable) | `components/home/sections.tsx` |
| Tours catalogue with filters + detail pages | `app/[lang]/tours`, `components/ToursExplorer.tsx` |
| Booking (server-priced, availability-checked, statuses, email) | `components/BookingForm.tsx`, `app/api/bookings` |
| WhatsApp (floating + prefilled tour/date/travelers/language) | `components/TourBookingCard.tsx`, `lib/whatsapp.ts` |
| Transfers, accommodation (inquiry-based), VIP planner, contact | `app/[lang]/{transfers,accommodation,vip,contact}` |
| Blog, legal pages, cookie consent (opt-in analytics) | `app/[lang]/{blog,legal}`, `components/CookieConsent.tsx` |
| Admin: bookings, requests, customers, tours, add-ons, promos, accommodation, vehicles, blog, translations, settings/SEO/payments, staff & roles, CSV export, uploads | `app/admin`, `app/api/admin` |
| DB schema for PostgreSQL/Supabase | `db/schema.sql` |

Docs: `docs/OWNER-SETUP.md` (non-technical guide) · `docs/DEPLOYMENT.md` · `docs/ARCHITECTURE.md`.

## Security notes
Server-side zod validation on every endpoint · prices computed on the server only · signed HttpOnly session cookie, scrypt password hashes, role-based permissions, origin check on admin writes, login rate-limiting · honeypot + rate-limits on public forms · CSV formula-injection protection · upload type/magic-byte checks · no card data stored · security headers in `next.config.mjs`.

## Known limits
* Default storage is a JSON file (single server). Use `db/schema.sql` + a Postgres implementation of `lib/store.ts` for serverless/multi-instance hosting.
* In-memory rate limiting is per instance; add a WAF/Redis limiter at scale.
* Translations were written carefully but should be reviewed by native speakers before launch (Admin → Translations lets you edit them).
* Not audited against WCAG 2.2 AA by a third party; built with semantic HTML, focus states, labels, reduced-motion support and 44px+ targets.
