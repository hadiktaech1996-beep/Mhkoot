"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Minus, Plus } from "lucide-react";
import { isDateAvailable, nextAvailableDate } from "@/lib/availability";
import { waLink } from "@/lib/whatsapp";
import { WaLink } from "./WaLink";

interface Props {
  lang: string; slug: string; title: string; waNumber: string; langName: string;
  weekdays: number[]; blackout: string[]; minDate: string;
  priceText: string; priceSuffix: string;
  t: { bookNow: string; whatsappInquiry: string; date: string; adults: string; children: string; unavailable: string; checkAvailability: string; msg: string; tour: string; dateL: string; travelers: string; langL: string; datePending: string; contact: string };
}

function Counter({ label, value, onChange, min }: { label: string; value: number; onChange: (n: number) => void; min: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm font-medium text-forest" id={`c-${label}`}>{label}</span>
      <div className="flex items-center gap-3" role="group" aria-labelledby={`c-${label}`}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`− ${label}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/25 text-forest transition hover:bg-forest hover:text-ivory disabled:opacity-35"><Minus size={16} /></button>
        <output className="w-6 text-center font-semibold" aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(20, value + 1))} aria-label={`+ ${label}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/25 text-forest transition hover:bg-forest hover:text-ivory"><Plus size={16} /></button>
      </div>
    </div>
  );
}

export function TourBookingCard({ lang, slug, title, waNumber, langName, weekdays, blackout, minDate, priceText, priceSuffix, t }: Props) {
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const avail = useMemo(() => (date ? isDateAvailable({ weekdays, blackout }, date) : true), [date, weekdays, blackout]);
  const suggestion = useMemo(() => nextAvailableDate({ weekdays, blackout }), [weekdays, blackout]);

  const q = new URLSearchParams({ tour: slug, adults: String(adults), children: String(children) });
  if (date && avail) q.set("date", date);

  const text = `${t.msg}\n${t.tour}: ${title}\n${t.dateL}: ${date || t.datePending}\n${t.travelers}: ${adults + children} (${adults}+${children})\n${t.langL}: ${langName}`;
  const wa = waLink(waNumber, text) || `/${lang}/contact`;

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-lift ring-1 ring-forest/5 sm:p-7">
      <p className="text-sm text-charcoal-400">{priceSuffix}</p>
      <p className="font-display text-4xl font-bold text-forest">{priceText}</p>
      <div className="mt-5 space-y-3">
        <div>
          <label htmlFor="bc-date" className="label flex items-center gap-2"><CalendarDays size={15} aria-hidden />{t.date}</label>
          <input id="bc-date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="field" aria-invalid={!avail || undefined} aria-describedby={!avail ? "bc-err" : undefined} />
          {!avail && (
            <p id="bc-err" className="mt-1.5 text-sm text-red-700">{t.unavailable} <button type="button" className="font-semibold underline underline-offset-4" onClick={() => setDate(suggestion)}>{suggestion}</button></p>
          )}
        </div>
        <div className="divide-y divide-forest/10 rounded-2xl bg-ivory px-4">
          <Counter label={t.adults} value={adults} min={1} onChange={setAdults} />
          <Counter label={t.children} value={children} min={0} onChange={setChildren} />
        </div>
      </div>
      <Link href={`/${lang}/book?${q}`} className="btn-primary mt-5 w-full !min-h-[54px] text-base">{t.bookNow}</Link>
      <WaLink href={wa} className="btn-whatsapp mt-3 w-full">{t.whatsappInquiry}</WaLink>
    </div>
  );
}
