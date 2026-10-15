import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Calendar, Check, Clock, MapPin, ShieldCheck, Users, X, Accessibility, Baby, Star } from "lucide-react";
import { isLang, tr, trList, LOCALES, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getPublishedTours, getSettings, getTourBySlug } from "@/lib/store";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { DESTINATIONS } from "@/lib/data/destinations";
import { minBookableDate } from "@/lib/availability";
import { displayPrice, fmtEUR } from "@/lib/pricing";
import { durationLabel, itineraryTime, weekdaysLabel } from "@/lib/format";
import { Media } from "@/components/Scene";
import { DemoBadge, TourCard } from "@/components/ui";
import { TourBookingCard } from "@/components/TourBookingCard";
import { MapEmbed } from "@/components/MapEmbed";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import type { SceneKind } from "@/lib/types";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getPublishedTours().map((t) => ({ lang, slug: t.slug })));
}

export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const lang = params.lang as Lang;
  const tour = isLang(lang) ? getTourBySlug(params.slug) : undefined;
  if (!tour) return {};
  const d = getDict(lang);
  const title = `${tr(tour.title, lang)} – ${tr(DESTINATIONS[tour.destination].name, lang)}`;
  return pageMeta({ lang, path: `/tours/${tour.slug}`, title, description: tr(tour.summary, lang) + " " + durationLabel(tour, d) + "." });
}

export default function TourPage({ params }: { params: { lang: string; slug: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const tour = getTourBySlug(params.slug);
  if (!tour) notFound();
  const d = getDict(lang);
  const settings = getSettings();
  const dest = DESTINATIONS[tour.destination];
  const title = tr(tour.title, lang);
  const price = displayPrice(tour);
  const related = tour.relatedIds.map((id) => getPublishedTours().find((t) => t.id === id)).filter(Boolean).slice(0, 3) as typeof tour[];
  const gal: SceneKind[] = [tour.scene, dest.scene !== tour.scene ? dest.scene : "mountain", "road"];
  const svc = (k: string) => (d.service as Record<string, string>)[k] || k;
  const td = d.tourDetail;

  const facts: [React.ReactNode, string, string][] = [
    [<MapPin key="a" size={18} />, td.destination, tr(dest.name, lang)],
    [<Clock key="b" size={18} />, td.duration, durationLabel(tour, d)],
    [<Users key="c" size={18} />, td.maxGroup, `${td.upTo} ${tour.maxGroup}`],
    [<Calendar key="d" size={18} />, td.availableOn, weekdaysLabel(tour, d)],
  ];

  const ld = {
    "@context": "https://schema.org", "@type": "TouristTrip", name: title, description: tr(tour.description, lang),
    inLanguage: lang, touristType: tr(tour.ages, lang),
    itinerary: { "@type": "ItemList", itemListElement: tour.itinerary.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: tr(s.title, lang) })) },
    provider: { "@type": "TravelAgency", name: "Sancak Tour", url: SITE_URL },
    // Price data is published to search engines only once real (non-demo) prices are set by the company.
    ...(!tour.sample && price ? { offers: { "@type": "Offer", price: price.amount, priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${SITE_URL}/${lang}/tours/${tour.slug}` } } : {}),
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: d.nav.home, item: `${SITE_URL}/${lang}` },
    { "@type": "ListItem", position: 2, name: d.nav.tours, item: `${SITE_URL}/${lang}/tours` },
    { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/${lang}/tours/${tour.slug}` },
  ] };

  return (
    <article>
      <section className="bg-forest-900 pb-0 pt-[calc(var(--header-h)+24px)]">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ivory/60">
            <Link href={`/${lang}/tours`} className="hover:text-gold">{d.nav.tours}</Link> <span aria-hidden>/</span> <span className="text-ivory/90">{title}</span>
          </nav>
          <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2 sm:gap-3 lg:h-[480px]">
            <div className="relative col-span-4 aspect-[16/10] overflow-hidden rounded-3xl sm:col-span-3 sm:row-span-2 sm:aspect-auto">
              <Media kind={gal[0]} src={tour.gallery?.[0] || tour.imageUrl} alt={title} className="h-full w-full" eager />
              <div className="absolute start-4 top-4 flex gap-2">{tour.sample && <DemoBadge label={d.common.sample} />}</div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="hidden overflow-hidden rounded-3xl sm:block"><Media kind={gal[i]} src={tour.gallery?.[i]} alt="" className="h-full w-full" /></div>
            ))}
          </div>
        </div>
        <div className="h-10 bg-gradient-to-b from-forest-900 to-ivory" />
      </section>

      <div className="container-x -mt-2 grid gap-10 pb-20 lg:grid-cols-[1fr_390px] lg:gap-14">
        <div className="min-w-0">
          <p className="eyebrow">{d.cat[tour.categories[0]]}</p>
          <h1 className="h-display mt-2 !text-4xl sm:!text-5xl">{title}</h1>
          <p className="lead mt-4">{tr(tour.summary, lang)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(([icon, k, v]) => (
              <div key={k} className="rounded-2xl bg-white p-4 shadow-card"><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-700">{icon}{k}</dt><dd className="mt-1.5 text-[15px] font-semibold text-forest">{v}</dd></div>
            ))}
          </dl>

          {tour.sample && <p className="mt-6 flex items-start gap-3 rounded-2xl bg-gold/20 p-4 text-sm text-forest"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />{d.common.sampleNote}</p>}

          <Reveal><h2 className="h-section mt-14 !text-3xl">{td.description}</h2><p className="mt-4 text-lg leading-[1.8] text-charcoal/90">{tr(tour.description, lang)}</p></Reveal>

          <Reveal><h2 className="h-section mt-14 !text-3xl">{td.highlights}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">{trList(tour.highlights, lang).map((h) => <li key={h} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card"><Star size={18} className="mt-0.5 shrink-0 text-gold-600" fill="currentColor" aria-hidden />{h}</li>)}</ul></Reveal>

          <Reveal><h2 className="h-section mt-14 !text-3xl">{td.itinerary}</h2>
            <ol className="relative mt-6 space-y-0 border-s-2 border-gold/50 ps-8">
              {tour.itinerary.map((s, i) => (
                <li key={i} className="relative pb-8 last:pb-0">
                  <span className="absolute -start-[calc(2rem+9px)] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold ring-4 ring-ivory" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold-700">{itineraryTime(s.time, d)}</p>
                  <p className="mt-0.5 font-display text-2xl font-semibold text-forest">{tr(s.title, lang)}</p>
                </li>
              ))}
            </ol></Reveal>

          <Reveal><div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-card"><h2 className="font-display text-2xl font-semibold text-forest">{td.included}</h2>
              <ul className="mt-4 space-y-3">{tour.included.map((k) => <li key={k} className="flex items-start gap-3 text-[15px]"><Check size={18} className="mt-0.5 shrink-0 text-olive-700" aria-hidden />{svc(k)}</li>)}</ul></div>
            <div className="rounded-3xl bg-white p-6 shadow-card"><h2 className="font-display text-2xl font-semibold text-forest">{td.excluded}</h2>
              <ul className="mt-4 space-y-3">{tour.excluded.map((k) => <li key={k} className="flex items-start gap-3 text-[15px] text-charcoal-500"><X size={18} className="mt-0.5 shrink-0 text-red-700/80" aria-hidden />{svc(k)}</li>)}</ul></div>
          </div></Reveal>

          <Reveal><h2 className="h-section mt-14 !text-3xl">{td.pickup}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 shadow-card"><h3 className="text-xs font-semibold uppercase tracking-wider text-gold-700">{td.pickup}</h3><p className="mt-2">{tr(tour.pickup, lang)}</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-card"><h3 className="text-xs font-semibold uppercase tracking-wider text-gold-700">{td.meeting}</h3><p className="mt-2">{tr(tour.meeting, lang)}</p></div>
            </div>
            <div className="mt-6"><MapEmbed lat={tour.lat} lng={tour.lng} title={`${td.map}: ${title}`} loadLabel={td.loadMap} privacy={td.mapPrivacy} /></div></Reveal>

          <Reveal><div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-card"><h2 className="flex items-center gap-2 font-display text-xl font-semibold text-forest"><Accessibility size={20} aria-hidden />{td.accessibility}</h2><p className="mt-2 text-[15px] text-charcoal-500">{tr(tour.accessibility, lang)}</p></div>
            <div className="rounded-2xl bg-white p-5 shadow-card"><h2 className="flex items-center gap-2 font-display text-xl font-semibold text-forest"><Baby size={20} aria-hidden />{td.ages}</h2><p className="mt-2 text-[15px] text-charcoal-500">{tr(tour.ages, lang)}{tour.childDiscountPct > 0 && tour.priceGroup > 0 ? ` ${td.children} ${tour.childDiscountPct}%.` : ""}</p></div>
            <div className="rounded-2xl bg-white p-5 shadow-card md:col-span-2"><h2 className="flex items-center gap-2 font-display text-xl font-semibold text-forest"><ShieldCheck size={20} aria-hidden />{td.cancellation}</h2><p className="mt-2 text-[15px] text-charcoal-500">{d.cancel[tour.cancellationKey]}</p><p className="mt-1 text-xs text-charcoal-400">{d.cancel.note}</p></div>
          </div></Reveal>

          <Reveal><h2 className="h-section mt-14 !text-3xl">{td.reviews}</h2>
            {tour.reviews.length ? (
              <ul className="mt-5 space-y-4">{tour.reviews.map((r, i) => <li key={i} className="rounded-2xl bg-white p-5 shadow-card"><div className="flex items-center justify-between"><b className="text-forest">{r.name}</b><span className="text-gold" aria-label={`${r.rating}/5`}>{"★".repeat(r.rating)}</span></div><p className="mt-2 text-charcoal-500">{tr(r.text, lang)}</p></li>)}</ul>
            ) : <p className="mt-4 rounded-2xl border border-dashed border-forest/25 p-6 text-charcoal-500">{td.noReviews}</p>}</Reveal>
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
          <TourBookingCard
            lang={lang} slug={tour.slug} title={title} waNumber={settings.whatsappNumber} langName={d.wa.langName}
            weekdays={tour.weekdays} blackout={tour.blackout} minDate={minBookableDate()}
            priceText={price ? `${d.common.from} ${fmtEUR(price.amount, lang)}` : d.common.onRequest}
            priceSuffix={price ? (price.unit === "person" ? d.common.perPerson : d.common.perGroup) : ""}
            t={{ bookNow: td.bookNow, whatsappInquiry: td.whatsappInquiry, date: d.booking.date, adults: d.common.adults, children: d.common.children, unavailable: d.booking.unavailable, checkAvailability: td.checkAvailability, msg: d.wa.tourMsg, tour: d.wa.tour, dateL: d.wa.date, travelers: d.wa.travelers, langL: d.wa.lang, datePending: d.wa.datePending, contact: d.nav.contact }}
          />
          {tour.pricePrivate > 0 && tour.priceGroup > 0 && <p className="mt-3 px-2 text-sm text-charcoal-500">{td.privateFrom}: <b className="text-forest">{fmtEUR(tour.pricePrivate, lang)}</b> {d.common.perGroup} ({td.upTo} {tour.privateMaxPax})</p>}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section bg-ivory-200/60"><div className="container-x">
          <h2 className="h-section">{td.related}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{related.map((t) => <TourCard key={t.id} tour={t} lang={lang} d={d} />)}</div>
        </div></section>
      )}
      <JsonLd data={ld} />
      <JsonLd data={crumbs} />
    </article>
  );
}
