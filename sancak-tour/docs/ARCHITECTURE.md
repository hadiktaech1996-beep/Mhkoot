# Architecture
* **Routing/i18n**: `/{lang}/…` with `lang ∈ ar|tr|en|de`; `middleware.ts` maps locale-less URLs to the remembered cookie language (default `en`); the browser language is only *suggested* via a dismissible banner. `<html lang dir>` is set per language (RTL for Arabic; logical Tailwind utilities).
* **Content**: translated fields are `{en,tr,ar,de}` objects; UI strings live in `lib/i18n/*` (typed against the English dictionary so a missing key fails the build) with runtime overrides from the admin.
* **Data**: `lib/store.ts` (JSON file) is the only persistence module; `db/schema.sql` is the Postgres target.
* **Pricing**: `lib/pricing.ts` is shared by browser preview and server; the server recomputes and is authoritative.
* **Payments**: `lib/payments.ts`; Stripe hosted Checkout (test keys only unless mode=live), signed webhook; no card data touches the app.
* **Admin**: schema-driven editor (`lib/admin/fields.ts` + `validators.ts`) so new entity types need no new UI code. Roles→permissions in `lib/types.ts`.
* **Media**: `components/Scene.tsx` renders original illustrations; any entity with `imageUrl` shows the real photo instead.
