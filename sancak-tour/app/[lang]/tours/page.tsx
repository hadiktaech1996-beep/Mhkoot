import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getPublishedTours, getSettings } from "@/lib/store";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { DESTINATIONS, DEST_KEYS } from "@/lib/data/destinations";
import { minBookableDate } from "@/lib/availability";
import { PageHero } from "@/components/PageHero";
import { TourCard, DemoBadge } from "@/components/ui";
import { ToursExplorer, type TourMeta } from "@/components/ToursExplorer";
import { JsonLd } from "@/components/JsonLd";
import type { Tour, TourCategory } from "@/lib/types";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.tours;
  return pageMeta({ lang, path: "/tours", title: o ? tr(o.title, lang) || d.toursPage.title : d.toursPage.title, description: o ? tr(o.description, lang) || d.toursPage.subtitle : d.toursPage.subtitle });
}

const CATS: TourCategory[] = ["sarajevo", "mostar", "kravice", "travnik", "nature", "family", "private", "vip", "multiday", "balkan", "custom"];
const perPerson = (t: Tour) => (t.priceGroup > 0 ? t.priceGroup : t.pricePrivate > 0 ? Math.round(t.pricePrivate / Math.max(1, t.privateMaxPax)) : 0);

export default function ToursPage({ params, searchParams }: { params: { lang: string }; searchParams: Record<string, string | undefined> }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const tours = getPublishedTours();
  const maxPrice = Math.max(100, Math.ceil(Math.max(...tours.map(perPerson), 0) / 50) * 50);
  const items = tours.map((t) => ({
    meta: { id: t.id, dest: t.destination, categories: t.categories, days: t.days, hours: t.hours, perPerson: perPerson(t), maxGroup: t.maxGroup, hasPrivate: t.pricePrivate > 0, featured: t.featured, weekdays: t.weekdays, blackout: t.blackout } satisfies TourMeta,
    node: <TourCard tour={t} lang={lang} d={d} />,
  }));
  const t = { ...d.toursPage, ...d.common, date: d.hero.date, reset: d.common.reset, results: d.common.results, noResults: d.common.noResults, any: d.common.any };

  return (
    <>
      <PageHero eyebrow={d.nav.tours} title={d.toursPage.title} subtitle={d.toursPage.subtitle} scene="kravice" />
      <section className="section !pt-10">
        <div className="container-x">
          {tours.some((x) => x.sample) && <p className="mb-8 flex items-center gap-3 rounded-2xl bg-gold/20 px-5 py-3 text-sm text-forest"><DemoBadge label={d.common.sample} />{d.common.sampleNote}</p>}
          <ToursExplorer
            items={items}
            maxPrice={maxPrice}
            minDate={minBookableDate()}
            initial={{ dest: searchParams.dest, cat: searchParams.cat, pax: searchParams.pax, date: searchParams.date }}
            destinations={DEST_KEYS.map((k) => ({ value: k, label: tr(DESTINATIONS[k].name, lang) }))}
            categories={CATS.map((c) => ({ value: c, label: d.cat[c] }))}
            t={t as unknown as Record<string, string>}
          />
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: tours.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${lang}/tours/${x.slug}`, name: tr(x.title, lang) })) }} />
    </>
  );
}
