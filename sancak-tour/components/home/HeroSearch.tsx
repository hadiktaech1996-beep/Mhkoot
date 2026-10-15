"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, CalendarDays, Users, Compass } from "lucide-react";
import type { Lang } from "@/lib/i18n/config";

interface Props {
  lang: Lang;
  t: { destination: string; anyDestination: string; date: string; travelers: string; category: string; anyCategory: string; search: string };
  destinations: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  minDate: string;
}

export function HeroSearch({ lang, t, destinations, categories, minDate }: Props) {
  const router = useRouter();
  const [v, setV] = useState({ dest: "", date: "", pax: "2", cat: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (v.dest) q.set("dest", v.dest);
    if (v.date) q.set("date", v.date);
    if (v.pax) q.set("pax", v.pax);
    if (v.cat) q.set("cat", v.cat);
    router.push(`/${lang}/tours${q.toString() ? `?${q}` : ""}`);
  };
  const wrap = "flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2.5 transition focus-within:bg-ivory hover:bg-ivory/70";
  const lab = "block text-[11px] font-semibold uppercase tracking-wider text-gold-700";
  const ctl = "w-full min-w-0 bg-transparent text-[15px] font-medium text-forest focus:outline-none";
  return (
    <form onSubmit={submit} role="search" className="mx-auto w-full max-w-5xl rounded-[28px] bg-white/95 p-2.5 shadow-lift backdrop-blur-xl lg:rounded-full lg:p-2">
      <div className="grid gap-1 sm:grid-cols-2 lg:flex lg:items-center">
        <label className={wrap}><MapPin size={20} className="shrink-0 text-olive-700" aria-hidden />
          <span className="min-w-0 flex-1"><span className={lab}>{t.destination}</span>
            <select className={ctl} value={v.dest} onChange={(e) => setV({ ...v, dest: e.target.value })}>
              <option value="">{t.anyDestination}</option>
              {destinations.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select></span></label>
        <label className={wrap}><CalendarDays size={20} className="shrink-0 text-olive-700" aria-hidden />
          <span className="min-w-0 flex-1"><span className={lab}>{t.date}</span>
            <input type="date" min={minDate} className={ctl} value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} /></span></label>
        <label className={wrap}><Users size={20} className="shrink-0 text-olive-700" aria-hidden />
          <span className="min-w-0 flex-1"><span className={lab}>{t.travelers}</span>
            <select className={ctl} value={v.pax} onChange={(e) => setV({ ...v, pax: e.target.value })}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}{n === 12 ? "+" : ""}</option>)}
            </select></span></label>
        <label className={wrap}><Compass size={20} className="shrink-0 text-olive-700" aria-hidden />
          <span className="min-w-0 flex-1"><span className={lab}>{t.category}</span>
            <select className={ctl} value={v.cat} onChange={(e) => setV({ ...v, cat: e.target.value })}>
              <option value="">{t.anyCategory}</option>
              {categories.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select></span></label>
        <button type="submit" className="btn-primary sm:col-span-2 lg:col-auto lg:!min-h-[60px] lg:px-9"><Search size={18} aria-hidden />{t.search}</button>
      </div>
    </form>
  );
}
