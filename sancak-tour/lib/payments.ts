import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Booking, Settings } from "./types";

/**
 * Payment architecture
 * --------------------
 * - Card data never touches this server: customers pay on Stripe's hosted Checkout page.
 * - Stripe is only used while the key is a TEST key (sk_test_...). A live key (sk_live_...) is refused
 *   unless the owner sets Payments -> Mode = "live" in the admin dashboard AFTER the merchant account is verified.
 * - PayPal and other providers plug in by implementing the same `PaymentProvider` shape.
 */
export interface CheckoutResult { url: string; reference: string }
export interface PaymentProvider {
  id: "stripe" | "paypal";
  isConfigured(settings: Settings): { ok: boolean; reason?: string };
  createCheckout(b: Booking, urls: { success: string; cancel: string }): Promise<CheckoutResult>;
}

export const stripeProvider: PaymentProvider = {
  id: "stripe",
  isConfigured(settings) {
    const key = process.env.STRIPE_SECRET_KEY || "";
    if (!key) return { ok: false, reason: "STRIPE_SECRET_KEY missing" };
    if (settings.payments.mode === "test" && !key.startsWith("sk_test_")) return { ok: false, reason: "Live key refused while mode=test" };
    if (settings.payments.mode === "live" && !key.startsWith("sk_live_")) return { ok: false, reason: "Mode=live requires a live key" };
    return { ok: true };
  },
  async createCheckout(b, urls) {
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("success_url", urls.success);
    form.set("cancel_url", urls.cancel);
    form.set("client_reference_id", b.ref);
    form.set("customer_email", b.customer.email);
    form.set("metadata[booking_id]", b.id);
    form.set("line_items[0][quantity]", "1");
    form.set("line_items[0][price_data][currency]", "eur");
    form.set("line_items[0][price_data][unit_amount]", String(Math.round(b.total * 100)));
    form.set("line_items[0][price_data][product_data][name]", `${b.tourTitle} (${b.date})`);
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || "stripe_error");
    return { url: json.url as string, reference: json.id as string };
  },
};

/** Verifies a Stripe webhook signature (Stripe-Signature header, v1 scheme, 5 min tolerance). */
export function verifyStripeSignature(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const given = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  return given.some((g) => g.length === expected.length && timingSafeEqual(Buffer.from(g), Buffer.from(expected)));
}

export function paymentAvailability(settings: Settings) {
  const stripe = stripeProvider.isConfigured(settings);
  return {
    card: settings.payments.card && stripe.ok,
    paypal: false, // PayPal adapter intentionally not connected until merchant credentials exist
    bank: settings.payments.bank,
    arrival: settings.payments.arrival,
    test: settings.payments.mode === "test",
  };
}
