import type { Tour } from "./types";

export const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Earliest bookable date: tomorrow (same-day bookings go through WhatsApp). */
export function minBookableDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return isoDate(d);
}

export function isDateAvailable(tour: Pick<Tour, "weekdays" | "blackout">, iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  if (iso < minBookableDate()) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (tour.weekdays.length && !tour.weekdays.includes(wd)) return false;
  return !tour.blackout.includes(iso);
}

export function nextAvailableDate(tour: Pick<Tour, "weekdays" | "blackout">): string {
  const d = new Date();
  for (let i = 1; i < 400; i++) {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const iso = isoDate(t);
    if (isDateAvailable(tour, iso)) return iso;
  }
  return minBookableDate();
}
