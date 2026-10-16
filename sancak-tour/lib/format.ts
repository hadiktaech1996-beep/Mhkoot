import type { Dict } from "./i18n";
import type { Tour } from "./types";

export function durationLabel(t: Pick<Tour, "days" | "hours">, d: Dict): string {
  if (t.days > 1) return `${t.days} ${d.common.days}`;
  return `${t.hours} ${d.common.hours}`;
}

/** "Day 3" → localized "يوم 3" / "Tag 3" … ; clock times pass through. */
export function itineraryTime(time: string, d: Dict): string {
  const m = /^Day (\d+)$/.exec(time);
  return m ? `${d.common.day[0].toUpperCase()}${d.common.day.slice(1)} ${m[1]}` : time;
}

export function weekdaysLabel(t: Pick<Tour, "weekdays">, d: Dict): string {
  if (!t.weekdays.length) return d.tourDetail.everyDay;
  return t.weekdays.map((i) => d.weekdays[i]).join(" · ");
}
