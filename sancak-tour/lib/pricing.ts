import type { Extra, Tour } from "./types";

export interface PriceInput {
  adults: number;
  children: number;
  mode: "group" | "private";
  extraIds: string[];
  promoPercent: number;
}
export interface PriceResult {
  base: number;
  extras: { id: string; total: number }[];
  subtotal: number;
  discount: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Single source of truth for price computation — used by the browser preview AND the server (which is authoritative). */
type PriceTour = Pick<Tour, "priceGroup" | "pricePrivate" | "privateMaxPax" | "childDiscountPct">;
export function computePrice(tour: PriceTour, extras: Pick<Extra, "id" | "price" | "perPerson">[], input: PriceInput): PriceResult {
  const pax = input.adults + input.children;
  let base = 0;
  if (input.mode === "private" && tour.pricePrivate > 0) {
    base = Math.ceil(Math.max(1, pax) / Math.max(1, tour.privateMaxPax)) * tour.pricePrivate;
  } else {
    base = input.adults * tour.priceGroup + input.children * tour.priceGroup * (1 - tour.childDiscountPct / 100);
  }
  const chosen = extras.filter((e) => input.extraIds.includes(e.id));
  const ex = chosen.map((e) => ({ id: e.id, total: round2(e.perPerson ? e.price * pax : e.price) }));
  const subtotal = round2(base + ex.reduce((s, e) => s + e.total, 0));
  const discount = round2((subtotal * Math.min(100, Math.max(0, input.promoPercent))) / 100);
  return { base: round2(base), extras: ex, subtotal, discount, total: round2(subtotal - discount) };
}

export const fmtEUR = (n: number, lang = "en") =>
  new Intl.NumberFormat(lang === "ar" ? "ar-EG-u-nu-latn" : lang === "de" ? "de-DE" : lang === "tr" ? "tr-TR" : "en-IE", {
    style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0,
  }).format(n);

/** Headline price: per-person group price when offered, otherwise the private-group price. */
export function displayPrice(t: Pick<Tour, "priceGroup" | "pricePrivate">): { amount: number; unit: "person" | "group" } | null {
  if (t.priceGroup > 0) return { amount: t.priceGroup, unit: "person" };
  if (t.pricePrivate > 0) return { amount: t.pricePrivate, unit: "group" };
  return null;
}
