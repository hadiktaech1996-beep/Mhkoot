"use client";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

export interface StayMeta { id: string; location: string; guests: number; price: number; amenities: string[]; type: string }
interface Props {
  items: { meta: StayMeta; node: React.ReactNode }[];
  locations: { value: string; label: string }[];
  types: { value: string; label: string }[];
  amenities: { value: string; label: string }[];
  maxPrice: number;
  t: { location: string; guests: string; amenitiesLabel: string; price: string; type: string; any: string; reset: string; noResults: string; results: string };
}
const sel = "field !min-h-[44px] !py-2 !text-sm";

export function StayExplorer({ items, locations, types, amenities, maxPrice, t }: Props) {
  const [f, setF] = useState({ loc: "", type: "", guests: 1, price: maxPrice, am: [] as string[] });
  const shown = useMemo(() => items.filter(({ meta: m }) =>
    (!f.loc || m.location === f.loc) && (!f.type || m.type === f.type) && m.guests >= f.guests && m.price <= f.price && f.am.every((a) => m.amenities.includes(a))), [items, f]);
  const dirty = f.loc || f.type || f.guests > 1 || f.price < maxPrice || f.am.length;
  return (
    <div>
      <div className="grid gap-4 rounded-3xl bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        <div><label className="label" htmlFor="s-loc">{t.location}</label><select id="s-loc" className={sel} value={f.loc} onChange={(e) => setF({ ...f, loc: e.target.value })}><option value="">{t.any}</option>{locations.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <div><label className="label" htmlFor="s-type">{t.type}</label><select id="s-type" className={sel} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="">{t.any}</option>{types.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <div><label className="label" htmlFor="s-g">{t.guests}</label><select id="s-g" className={sel} value={f.guests} onChange={(e) => setF({ ...f, guests: Number(e.target.value) })}>{[1, 2, 3, 4, 5, 6, 8].map((n) => <option key={n} value={n}>{n}+</option>)}</select></div>
        <div><label className="label" htmlFor="s-p">{t.price}: <b className="text-gold-700">€{f.price}</b></label><input id="s-p" type="range" min={30} max={maxPrice} step={5} value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} className="h-11 w-full accent-forest" /></div>
        <fieldset className="sm:col-span-2 lg:col-span-4"><legend className="label">{t.amenitiesLabel}</legend>
          <div className="flex flex-wrap gap-2">{amenities.map((a) => (
            <label key={a.value} className="chip cursor-pointer !px-4 !py-2 text-sm has-[:checked]:bg-forest has-[:checked]:text-ivory has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold">
              <input type="checkbox" className="sr-only" checked={f.am.includes(a.value)} onChange={() => setF({ ...f, am: f.am.includes(a.value) ? f.am.filter((x) => x !== a.value) : [...f.am, a.value] })} />{a.label}</label>))}</div></fieldset>
      </div>
      <div className="mt-6 flex items-center justify-between"><p className="text-sm text-charcoal-500" role="status" aria-live="polite"><b className="text-forest">{shown.length}</b> {t.results}</p>
        {dirty && <button type="button" className="btn-ghost !min-h-[44px]" onClick={() => setF({ loc: "", type: "", guests: 1, price: maxPrice, am: [] })}><X size={16} aria-hidden />{t.reset}</button>}</div>
      {shown.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map(({ meta, node }) => <div key={meta.id}>{node}</div>)}</div>
        : <p className="mt-6 rounded-3xl border border-dashed border-forest/25 p-10 text-center text-charcoal-500">{t.noResults}</p>}
    </div>
  );
}
