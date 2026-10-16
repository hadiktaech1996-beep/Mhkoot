import { NextResponse } from "next/server";
import { z } from "zod";
import { getExtras, getPromo, getSettings, getTourById, mutateDb, newId } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isDateAvailable } from "@/lib/availability";
import { computePrice } from "@/lib/pricing";
import { paymentAvailability, stripeProvider } from "@/lib/payments";
import { sendMail } from "@/lib/mail";
import { bookingEmail } from "@/lib/booking-email";
import { SITE_URL } from "@/lib/seo";
import { isLang, tr } from "@/lib/i18n/config";
import type { Booking } from "@/lib/types";

const schema = z.object({
  lang: z.string().refine(isLang),
  tourId: z.string().min(1).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20),
  mode: z.enum(["group", "private"]),
  extraIds: z.array(z.string().max(60)).max(20),
  promoCode: z.string().max(40).optional(),
  paymentMethod: z.enum(["card", "paypal", "bank", "arrival"]),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(5).max(40),
    country: z.string().trim().max(80).default(""),
    notes: z.string().trim().max(2000).default(""),
  }),
});

export async function POST(req: Request) {
  if (!rateLimit(`book:${clientIp(req)}`, 6, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }
  if ((json as any)?.website) return NextResponse.json({ ok: true, ref: "SB-000000", id: "x" }); // honeypot
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  const v = parsed.data;
  const lang = v.lang as "ar" | "tr" | "en" | "de";

  // --- everything below uses SERVER-side data; client-sent prices are never trusted ---
  const tour = getTourById(v.tourId);
  if (!tour || !tour.published) return NextResponse.json({ error: "tour_not_found" }, { status: 404 });
  if (!isDateAvailable(tour, v.date)) return NextResponse.json({ error: "date_unavailable" }, { status: 422 });
  if (v.mode === "private" && tour.pricePrivate <= 0) return NextResponse.json({ error: "mode_unavailable" }, { status: 422 });
  if (v.mode === "group" && tour.priceGroup <= 0) return NextResponse.json({ error: "mode_unavailable" }, { status: 422 });
  if (v.mode === "group" && v.adults + v.children > tour.maxGroup) return NextResponse.json({ error: "group_too_large" }, { status: 422 });

  const settings = getSettings();
  const avail = paymentAvailability(settings);
  if (!avail[v.paymentMethod]) return NextResponse.json({ error: "payment_unavailable" }, { status: 422 });

  const extras = getExtras();
  const promo = v.promoCode ? getPromo(v.promoCode) : undefined;
  const price = computePrice(tour, extras, { adults: v.adults, children: v.children, mode: v.mode, extraIds: v.extraIds, promoPercent: promo?.percent || 0 });

  const booking: Booking = {
    id: newId("bk"), ref: `SB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, createdAt: new Date().toISOString(),
    status: "pending", lang, tourId: tour.id, tourTitle: tr(tour.title, lang), date: v.date, adults: v.adults, children: v.children, mode: v.mode,
    extras: price.extras.map((e) => { const x = extras.find((y) => y.id === e.id)!; return { id: e.id, label: tr(x.label, lang), qty: 1, total: e.total }; }),
    promoCode: promo?.code, discount: price.discount, total: price.total, currency: "EUR",
    paymentMethod: v.paymentMethod, paymentStatus: v.paymentMethod === "card" ? "awaiting" : "unpaid",
    customer: v.customer, sample: tour.sample,
  };

  let checkoutUrl: string | undefined;
  if (v.paymentMethod === "card") {
    try {
      const co = await stripeProvider.createCheckout(booking, {
        success: `${SITE_URL}/${lang}/booking/confirmation?id=${booking.id}&paid=1`,
        cancel: `${SITE_URL}/${lang}/booking/confirmation?id=${booking.id}`,
      });
      checkoutUrl = co.url; booking.paymentRef = co.reference;
    } catch (e) {
      console.error("[stripe] checkout failed", e);
      return NextResponse.json({ error: "payment_provider_error" }, { status: 502 });
    }
  }

  await mutateDb((db) => { db.bookings.unshift(booking); });

  const mail = bookingEmail(booking, settings.payments.bankDetails);
  const customerMail = await sendMail({ to: booking.customer.email, ...mail });
  const notify = process.env.MAIL_NOTIFY_TO || settings.company.email;
  if (notify) await sendMail({ to: notify, replyTo: booking.customer.email, subject: `[Sancak Tour] New booking ${booking.ref}`, html: mail.html, text: mail.text });

  return NextResponse.json({ ok: true, ref: booking.ref, id: booking.id, checkoutUrl, emailSent: customerMail.sent });
}
