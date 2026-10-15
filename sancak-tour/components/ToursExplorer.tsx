"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { isDateAvailable } from "@/lib/availability";

export interface TourMeta {
  id: string; dest: string; categories: string[]; days: number; hours: number; perPerson: number; maxGroup: number;
  hasPrivate: boolean; featured: boolean; weekdays: number[]; blackout: string[];
}
interface Props {
  items: { meta: TourMeta; node: React.ReactNode }[];
  destinations: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  maxPrice: number;
  initial: { dest?: string; cat?: string; pax?: string; date?: string };
  t: Record<string, string>;
  minDate: string;
}

const sel = "field !min-h-[44px] !py-2 !text-sm";

export function ToursExplorer({ items, destinations, categories, maxPrice, initial, t, minDate }: Props) {
  const paxN = Number(initial.pax || 0);
  const [f, setF] = useState({
    dest: initial.dest || "", cat: initial.cat || "", duration: "", size: paxN >= 7 ? "3" : paxN >= 3 ? "2" : "", price: maxPrice, date: initial.date || "", sort: "featured",
  });
  const [open, setOpen] = useState(false);
  const set = (k: keyof typeof f, v: string | number) => setF((s) => ({ ...s, [k]: v }));

  const shown = useMemo(() => {
    const list = items.filter(({ meta: m }) => {
      if (f.dest && m.dest !== f.dest && !(f.dest === "mostar" && m.dest === "blagaj")) return false;
      if (f.cat && !m.categories.includes(f.cat)) return false;
      if (f.duration === "half" && !(m.days === 1 && m.hours <= 6)) return false;
      if (f.duration === "full" && !(m.days === 1 && m.hours > 6)) return false;
      if (f.duration === "multi" && !(m.days > 1)) return false;
      if (f.size === "2" && m.maxGroup < 3) return false;
      if (f.size === "3" && m.maxGroup < 7) return false;
      if (m.perPerson > f.price) return false;
      if (f.date && !isDateAvailable({ weekdays: m.weekdays, blackout: m.blackout }, f.date)) return false;
      return true;
    });
    const dur = (m: TourMeta) => m.days * 24 + m.hours;
    return list.sort((a, b) => {
      if (f.sort === "priceAsc") return a.meta.perPerson - b.meta.perPerson;
      if (f.sort === "priceDesc") return b.meta.perPerson - a.meta.perPerson;
      if (f.sort === "duration") return dur(a.meta) - dur(b.meta);
      return Number(b.meta.featured) - Number(a.meta.featured);
    });
  }, [items, f]);

  const dirty = f.dest || f.cat || f.duration || f.size || f.date || f.price < maxPrice;
  const reset = () => setF({ dest: "", cat: "", duration: "", size: "", price: maxPrice, date: "", sort: "featured" });

  const filters = (
    <div className="space-y-5">
      <div><label className="label" htmlFor="f-dest">{t.destination}</label>
        <select id="f-dest" className={sel} value={f.dest} onChange={(e) => set("dest", e.target.value)}><option value="">{t.any}</option>{destinations.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
      <div><label className="label" htmlFor="f-cat">{t.category}</label>
        <select id="f-cat" className={sel} value={f.cat} onChange={(e) => set("cat", e.target.value)}><option value="">{t.any}</option>{categories.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
      <div><label className="label" htmlFor="f-dur">{t.duration}</label>
        <select id="f-dur" className={sel} value={f.duration} onChange={(e) => set("duration", e.target.value)}>
          <option value="">{t.anyDuration}</option><option value="half">{t.halfDay}</option><option value="full">{t.fullDay}</option><option value="multi">{t.multiDay}</option></select></div>
      <div><label className="label" htmlFor="f-date">{t.date}</label>
        <input id="f-date" type="date" min={minDate} className={sel} value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
      <div><label className="label" htmlFor="f-size">{t.group}</label>
        <select id="f-size" className={sel} value={f.size} onChange={(e) => set("size", e.target.value)}>
          <option value="">{t.anySize}</option><option value="1">{t.size1}</option><option value="2">{t.size2}</option><option value="3">{t.size3}</option></select></div>
      <div><label className="label" htmlFor="f-price">{t.price}: <b className="text-gold-700">€{f.price}</b></label>
        <input id="f-price" type="range" min={0} max={maxPrice} step={5} value={f.price} onChange={(e) => set("price", Number(e.target.value))} className="h-11 w-full accent-forest" /></div>
      {dirty && <button type="button" onClick={reset} className="btn-ghost w-full !min-h-[44px]"><X size={16} aria-hidden />{t.reset}</button>}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[290px_1fr] lg:gap-10">
      <aside aria-label={t.filters}>
        <button type="button" className="btn-ghost w-full lg:hidden" aria-expanded={open} onClick={() => setOpen((o) => !o)}><SlidersHorizontal size={16} aria-hidden />{open ? t.filters : t.showFilters}</button>
        <div className={`${open ? "mt-4 block" : "hidden"} rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:mt-0 lg:block`}>
          <h2 className="mb-5 hidden font-display text-2xl font-semibold text-forest lg:block">{t.filters}</h2>
          {filters}
        </div>
      </aside>
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-charcoal-500" role="status" aria-live="polite"><b className="text-forest">{shown.length}</b> {t.results}</p>
          <div className="flex items-center gap-2"><label htmlFor="f-sort" className="text-sm text-charcoal-500">{t.sortBy}</label>
            <select id="f-sort" className={`${sel} !w-auto`} value={f.sort} onChange={(e) => set("sort", e.target.value)}>
              <option value="featured">{t.sortFeatured}</option><option value="priceAsc">{t.sortPriceAsc}</option><option value="priceDesc">{t.sortPriceDesc}</option><option value="duration">{t.sortDuration}</option></select></div>
        </div>
        {shown.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{shown.map(({ meta, node }) => <div key={meta.id}>{node}</div>)}</div>
        ) : (
          <div className="rounded-3xl border border-dashed border-forest/25 p-12 text-center"><p className="text-charcoal-500">{t.noResults}</p><button type="button" onClick={reset} className="btn-primary mt-5">{t.reset}</button></div>
        )}
      </div>
    </div>
  );
}
