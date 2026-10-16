"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Landmark, Loader2, Minus, Plus, Wallet, Banknote, Info } from "lucide-react";
import { computePrice, fmtEUR } from "@/lib/pricing";
import { isDateAvailable, nextAvailableDate } from "@/lib/availability";
import { waLink } from "@/lib/whatsapp";
import { WaLink } from "./WaLink";

interface TourOpt { id: string; slug: string; title: string; priceGroup: number; pricePrivate: number; privateMaxPax: number; childDiscountPct: number; maxGroup: number; weekdays: number[]; blackout: string[] }
interface ExtraOpt { id: string; label: string; price: number; perPerson: boolean }
type T = Record<string, string>;
interface Props {
  lang: string; tours: TourOpt[]; extras: ExtraOpt[]; minDate: string; waNumber: string;
  pay: { card: boolean; paypal: boolean; bank: boolean; arrival: boolean; test: boolean };
  initial: { tour?: string; date?: string; adults?: number; children?: number };
  t: T; waT: T;
}

const stepNames = ["step1", "step2", "step3", "step4"];

export function BookingForm({ lang, tours, extras, minDate, waNumber, pay, initial, t, waT }: Props) {
  const router = useRouter();
  const first = tours.find((x) => x.slug === initial.tour) || null;
  const [step, setStep] = useState(0);
  const [tourId, setTourId] = useState(first?.id || "");
  const [date, setDate] = useState(initial.date || "");
  const [mode, setMode] = useState<"group" | "private">(first && first.priceGroup <= 0 ? "private" : "group");
  const [adults, setAdults] = useState(initial.adults || 2);
  const [children, setChildren] = useState(initial.children || 0);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [promo, setPromo] = useState({ code: "", percent: 0, state: "" as "" | "ok" | "bad" });
  const [c, setC] = useState({ name: "", email: "", phone: "", country: "", notes: "" });
  const [method, setMethod] = useState<"card" | "paypal" | "bank" | "arrival">(pay.bank ? "bank" : pay.arrival ? "arrival" : "card");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [srv, setSrv] = useState("");
  const [website, setWebsite] = useState("");

  const tour = tours.find((x) => x.id === tourId);
  const privateOk = !!tour && tour.pricePrivate > 0;
  const groupOk = !!tour && tour.priceGroup > 0;
  const effMode = tour ? (mode === "private" && privateOk ? "private" : groupOk ? "group" : "private") : mode;
  const dateOk = !!tour && !!date && isDateAvailable(tour, date);

  const price = useMemo(
    () => (tour ? computePrice(tour, extras, { adults, children, mode: effMode, extraIds, promoPercent: promo.percent }) : null),
    [tour, extras, adults, children, effMode, extraIds, promo.percent],
  );

  const toggleExtra = (id: string) => setExtraIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function applyPromo() {
    if (!promo.code.trim()) return;
    const r = await fetch(`/api/promo?code=${encodeURIComponent(promo.code.trim())}`).then((x) => x.json()).catch(() => ({ ok: false }));
    setPromo((p) => (r.ok ? { code: r.code, percent: r.percent, state: "ok" } : { ...p, percent: 0, state: "bad" }));
  }

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!tour) e.tour = t.errorTour;
      if (!dateOk) e.date = t.errorDate;
    }
    if (s === 1 && tour && effMode === "group" && adults + children > tour.maxGroup) e.adults = `${t.maxGroup}: ${tour.maxGroup}`;
    if (s === 2) {
      if (c.name.trim().length < 2) e.name = t.required;
      if (!/^\S+@\S+\.\S+$/.test(c.email)) e.email = t.required;
      if (c.phone.trim().length < 5) e.phone = t.required;
    }
    if (s === 3 && !agree) e.agree = t.required;
    setErr(e);
    return Object.keys(e).length === 0;
  }

  const next = () => { if (validate(step)) { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

  async function submit() {
    if (!validate(3) || !tour) return;
    setBusy(true); setSrv("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, tourId, date, adults, children, mode: effMode, extraIds, promoCode: promo.state === "ok" ? promo.code : undefined, paymentMethod: method, consent: agree, website, customer: c }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setSrv(j.error === "date_unavailable" ? t.unavailable : t.errorGeneric); setBusy(false); return; }
      if (j.checkoutUrl) { window.location.href = j.checkoutUrl; return; }
      router.push(`/${lang}/booking/confirmation?id=${j.id}`);
    } catch { setSrv(t.errorGeneric); setBusy(false); }
  }

  const waText = tour
    ? `${waT.msg}\n${waT.tour}: ${tour.title}\n${waT.date}: ${date || waT.datePending}\n${waT.travelers}: ${adults + children} (${adults}+${children})\n${waT.lang}: ${waT.langName}`
    : waT.msg;
  const wa = waLink(waNumber, waText) || `/${lang}/contact`;

  const Counter = ({ label, value, set, min }: { label: string; value: number; set: (n: number) => void; min: number }) => (
    <div className="flex items-center justify-between rounded-2xl bg-ivory px-4 py-3">
      <span className="font-medium text-forest">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`− ${label}`} disabled={value <= min} onClick={() => set(value - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/25 hover:bg-forest hover:text-ivory disabled:opacity-35"><Minus size={16} /></button>
        <output className="w-7 text-center text-lg font-semibold">{value}</output>
        <button type="button" aria-label={`+ ${label}`} onClick={() => set(Math.min(20, value + 1))} className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/25 hover:bg-forest hover:text-ivory"><Plus size={16} /></button>
      </div>
    </div>
  );

  const payOpts: { id: "card" | "paypal" | "bank" | "arrival"; label: string; info: string; icon: React.ReactNode; on: boolean }[] = [
    { id: "card", label: t.card, info: t.cardInfo, icon: <CreditCard size={20} />, on: pay.card },
    { id: "paypal", label: t.paypal, info: "", icon: <Wallet size={20} />, on: pay.paypal },
    { id: "bank", label: t.bank, info: t.bankInfo, icon: <Landmark size={20} />, on: pay.bank },
    { id: "arrival", label: t.arrival, info: t.arrivalInfo, icon: <Banknote size={20} />, on: pay.arrival },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div>
        <ol className="mb-8 flex gap-2" aria-label={t.title}>
          {stepNames.map((k, i) => (
            <li key={k} className="min-w-0 flex-1" aria-current={i === step ? "step" : undefined}>
              <div className={`h-1.5 rounded-full transition ${i <= step ? "bg-gold" : "bg-forest/15"}`} />
              <p className={`mt-2 truncate text-xs font-semibold uppercase tracking-wider ${i === step ? "text-forest" : "text-charcoal-400"}`}>{i + 1}. {t[k]}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-9">
          {/* honeypot */}
          <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" /></div>

          {step === 0 && (
            <div className="space-y-6">
              <div><label htmlFor="b-tour" className="label">{t.tour}</label>
                <select id="b-tour" className="field" value={tourId} aria-invalid={!!err.tour || undefined} onChange={(e) => { setTourId(e.target.value); setDate(""); }}>
                  <option value="">{t.chooseTour}</option>{tours.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</select>
                {err.tour && <p className="mt-1 text-sm text-red-700">{err.tour}</p>}</div>
              <div><label htmlFor="b-date" className="label">{t.date}</label>
                <input id="b-date" type="date" min={minDate} className="field" value={date} aria-invalid={!!err.date || undefined} onChange={(e) => setDate(e.target.value)} disabled={!tour} />
                <p className="mt-1 text-xs text-charcoal-400">{t.dateHelp}</p>
                {tour && date && !dateOk && <p className="mt-1 text-sm text-red-700">{t.unavailable} <button type="button" className="font-semibold underline" onClick={() => setDate(nextAvailableDate(tour))}>{nextAvailableDate(tour)}</button></p>}
                {err.date && !(tour && date && !dateOk) && <p className="mt-1 text-sm text-red-700">{err.date}</p>}</div>
              <fieldset><legend className="label">{t.mode}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([["group", t.group, groupOk || !tour], ["private", t.private, privateOk || !tour]] as const).map(([v, label, ok]) => (
                    <label key={v} className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 transition ${effMode === v ? "border-forest bg-forest/5" : "border-forest/15"} ${!ok ? "cursor-not-allowed opacity-45" : ""}`}>
                      <input type="radio" name="mode" className="h-5 w-5 accent-forest" checked={effMode === v} disabled={!ok} onChange={() => setMode(v)} />
                      <span><b className="text-forest">{label}</b>{!ok && <span className="block text-xs text-charcoal-400">{t.privateUnavailable}</span>}</span>
                    </label>
                  ))}
                </div></fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <Counter label={t.adults} value={adults} set={setAdults} min={1} />
              <Counter label={t.children} value={children} set={setChildren} min={0} />
              {err.adults && <p className="text-sm text-red-700">{err.adults}</p>}
              <fieldset><legend className="label">{t.extras}</legend>
                <div className="space-y-2.5">{extras.map((x) => (
                  <label key={x.id} className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-forest/15 px-4 py-3 has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                    <input type="checkbox" className="h-5 w-5 accent-forest" checked={extraIds.includes(x.id)} onChange={() => toggleExtra(x.id)} />
                    <span className="flex-1 text-[15px]">{x.label}</span><b className="text-forest">{fmtEUR(x.price, lang)}</b>
                  </label>))}</div></fieldset>
              <div><label htmlFor="b-promo" className="label">{t.promo}</label>
                <div className="flex gap-2"><input id="b-promo" className="field uppercase" value={promo.code} onChange={(e) => setPromo({ code: e.target.value, percent: 0, state: "" })} dir="ltr" />
                  <button type="button" className="btn-ghost shrink-0" onClick={applyPromo}>{t.apply}</button></div>
                {promo.state === "ok" && <p className="mt-1 text-sm text-olive-700" role="status">✓ {t.promoOk} (−{promo.percent}%)</p>}
                {promo.state === "bad" && <p className="mt-1 text-sm text-red-700" role="alert">{t.promoBad}</p>}</div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {([["name", t.name, "text", "name"], ["email", t.email, "email", "email"], ["phone", t.phone, "tel", "tel"], ["country", t.country, "text", "country-name"]] as const).map(([k, label, type, ac]) => (
                <div key={k}><label htmlFor={`c-${k}`} className="label">{label}{k !== "country" && <span className="text-red-700" aria-hidden> *</span>}</label>
                  <input id={`c-${k}`} type={type} autoComplete={ac} className="field" value={c[k]} aria-invalid={!!err[k] || undefined} dir={type === "email" || type === "tel" ? "ltr" : undefined} onChange={(e) => setC({ ...c, [k]: e.target.value })} />
                  {err[k] && <p className="mt-1 text-sm text-red-700">{err[k]}</p>}</div>
              ))}
              <div className="sm:col-span-2"><label htmlFor="c-notes" className="label">{t.notes}</label><textarea id="c-notes" rows={4} maxLength={2000} className="field" value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} /></div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <fieldset><legend className="label">{t.payment}</legend>
                <div className="space-y-2.5">{payOpts.map((o) => (
                  <label key={o.id} className={`flex min-h-[60px] items-start gap-3 rounded-2xl border-2 px-4 py-3.5 transition ${method === o.id && o.on ? "border-forest bg-forest/5" : "border-forest/15"} ${o.on ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                    <input type="radio" name="pay" className="mt-1 h-5 w-5 accent-forest" disabled={!o.on} checked={method === o.id} onChange={() => setMethod(o.id)} />
                    <span className="flex-1"><span className="flex items-center gap-2 font-semibold text-forest">{o.icon}{o.label}{!o.on && <span className="chip !py-0.5">{t.notConnected}</span>}</span>
                      {o.on && o.info && method === o.id && <span className="mt-1 block text-sm text-charcoal-500">{o.info}</span>}</span>
                  </label>))}</div>
                {pay.test && pay.card && <p className="mt-3 flex items-start gap-2 text-sm text-gold-700"><Info size={16} className="mt-0.5 shrink-0" aria-hidden />{t.testMode}</p>}</fieldset>
              <label className="flex items-start gap-3 text-sm text-charcoal-500">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-forest" checked={agree} aria-invalid={!!err.agree || undefined} onChange={(e) => setAgree(e.target.checked)} />
                <span>{t.terms} (<Link className="font-medium text-forest underline" href={`/${lang}/legal/booking-conditions`} target="_blank">{t.bookingConditions}</Link> · <Link className="font-medium text-forest underline" href={`/${lang}/legal/cancellation`} target="_blank">{t.cancellation}</Link> · <Link className="font-medium text-forest underline" href={`/${lang}/legal/privacy`} target="_blank">{t.privacy}</Link>)</span>
              </label>
              {err.agree && <p className="text-sm text-red-700">{t.required}</p>}
              {srv && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{srv}</p>}
              <p className="text-xs text-charcoal-400">{t.disclaimer}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            {step > 0 ? <button type="button" className="btn-ghost" onClick={() => setStep(step - 1)}>{t.back}</button> : <span />}
            {step < 3 ? <button type="button" className="btn-primary min-w-[160px]" onClick={next}>{t.next}</button>
              : <button type="button" className="btn-gold min-w-[220px] !min-h-[54px] text-base" disabled={busy} onClick={submit}>{busy && <Loader2 size={18} className="animate-spin" aria-hidden />}{t.submit}</button>}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
        <div className="rounded-[2rem] bg-forest p-7 text-ivory shadow-lift">
          <h2 className="font-display text-2xl font-semibold">{t.summary}</h2>
          {tour && price ? (
            <dl className="mt-5 space-y-3 text-sm">
              <div><dt className="text-ivory/60">{t.tour}</dt><dd className="font-semibold">{tour.title}</dd></div>
              {date && <div className="flex justify-between"><dt className="text-ivory/60">{t.date}</dt><dd className="font-semibold" dir="ltr">{date}</dd></div>}
              <div className="flex justify-between"><dt className="text-ivory/60">{t.mode}</dt><dd className="font-semibold">{effMode === "private" ? t.private : t.group}</dd></div>
              <div className="flex justify-between"><dt className="text-ivory/60">{t.adults} / {t.children}</dt><dd className="font-semibold">{adults} / {children}</dd></div>
              <div className="flex justify-between"><dt className="text-ivory/60">{t.tour}</dt><dd>{fmtEUR(price.base, lang)}</dd></div>
              {price.extras.map((e) => <div key={e.id} className="flex justify-between"><dt className="text-ivory/60">{extras.find((x) => x.id === e.id)?.label}</dt><dd>{fmtEUR(e.total, lang)}</dd></div>)}
              {price.discount > 0 && <div className="flex justify-between text-gold"><dt>{t.discount}</dt><dd>− {fmtEUR(price.discount, lang)}</dd></div>}
              <div className="flex items-baseline justify-between border-t border-white/15 pt-4"><dt className="text-base">{t.total}</dt><dd className="font-display text-4xl font-bold text-gold">{fmtEUR(price.total, lang)}</dd></div>
            </dl>
          ) : <p className="mt-4 text-sm text-ivory/60">{t.chooseTour}</p>}
          <p className="mt-5 flex items-start gap-2 text-xs text-ivory/55"><Info size={14} className="mt-0.5 shrink-0" aria-hidden />{t.sampleNote}</p>
        </div>
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-card"><p className="text-sm text-charcoal-500">{t.whatsappInstead}</p><WaLink href={wa} className="btn-whatsapp mt-3 w-full">{t.whatsappCta}</WaLink></div>
      </aside>
    </div>
  );
}
