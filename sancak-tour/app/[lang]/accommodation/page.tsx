import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, Info } from "lucide-react";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getPublishedStays, getSettings } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { fmtEUR } from "@/lib/pricing";
import { stayFields } from "@/lib/forms";
import { PageHero } from "@/components/PageHero";
import { Media } from "@/components/Scene";
import { RequestForm } from "@/components/RequestForm";
import { StayExplorer } from "@/components/StayExplorer";
import { DemoBadge, SectionHeading } from "@/components/ui";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.accommodation;
  return pageMeta({ lang, path: "/accommodation", title: o ? tr(o.title, lang) || d.stay.title : d.stay.title, description: o ? tr(o.description, lang) || d.stay.subtitle : d.stay.subtitle });
}

export default function AccommodationPage({ params, searchParams }: { params: { lang: string }; searchParams: { listing?: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const stays = getPublishedStays();
  const items = stays.map((s) => ({
    meta: { id: s.id, location: s.location, guests: s.guests, price: s.pricePerNight, amenities: s.amenities, type: s.type },
    node: (
      <article id={s.slug} className="card flex h-full flex-col">
        <div className="relative aspect-[4/3]"><Media kind={s.scene} src={s.imageUrl} alt="" className="h-full w-full" />
          <div className="absolute start-3 top-3 flex gap-1.5"><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest">{d.stay.types[s.type]}</span>{s.sample && <DemoBadge label={d.common.sample} />}</div></div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-2xl font-semibold text-forest">{tr(s.name, lang)}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-charcoal-500"><BedDouble size={15} aria-hidden />{d.stay.locations[s.location]} · {s.guests} {d.common.guests}</p>
          <p className="mt-2 text-sm text-charcoal-500">{tr(s.description, lang)}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">{s.amenities.slice(0, 5).map((a) => <li key={a} className="chip">{(d.stay.amenities as Record<string, string>)[a] || a}</li>)}</ul>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <p className="text-xs text-charcoal-400">{d.common.from} <b className="font-display text-2xl text-forest">{fmtEUR(s.pricePerNight, lang)}</b> {d.common.perNight}<br />({d.common.priceSample})</p>
            <Link href={`/${lang}/accommodation?listing=${encodeURIComponent(tr(s.name, lang))}#inquiry`} className="btn-ghost !min-h-[44px] !px-4 text-xs">{d.stay.inquire}</Link>
          </div>
        </div>
      </article>
    ),
  }));
  const maxPrice = Math.max(100, Math.ceil(Math.max(...stays.map((s) => s.pricePerNight), 0) / 50) * 50);
  return (
    <>
      <PageHero eyebrow={d.nav.stay} title={d.stay.title} subtitle={d.stay.subtitle} scene="blagaj" />
      <section className="section !pt-10">
        <div className="container-x">
          <p className="mb-8 flex items-start gap-3 rounded-2xl bg-gold/20 px-5 py-3 text-sm text-forest"><Info size={18} className="mt-0.5 shrink-0" aria-hidden />{d.stay.inquiryNote} {d.common.sampleNote}</p>
          <StayExplorer
            items={items} maxPrice={maxPrice}
            locations={Object.entries(d.stay.locations).map(([value, label]) => ({ value, label }))}
            types={Object.entries(d.stay.types).map(([value, label]) => ({ value, label }))}
            amenities={Object.entries(d.stay.amenities).map(([value, label]) => ({ value, label }))}
            t={{ location: d.stay.location, guests: d.stay.guests, amenitiesLabel: d.stay.amenitiesLabel, price: d.stay.price, type: d.stay.type, any: d.common.any, reset: d.common.reset, noResults: d.common.noResults, results: d.common.results }}
          />
        </div>
      </section>
      <section id="inquiry" className="section bg-ivory-200/60">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow={d.nav.stay} title={d.stay.formTitle} subtitle={d.stay.custom} />
          <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-9">
            <RequestForm type="accommodation" lang={lang} fields={stayFields(d, { listing: searchParams.listing })} labels={{ submit: d.stay.submit, success: d.common.sent, successNote: d.common.sentNote, consent: d.common.consentLabel, privacy: d.common.privacyLink, error: d.common.errorGeneric, ref: d.common.ref, required: d.common.required }} />
          </div>
        </div>
      </section>
    </>
  );
}
