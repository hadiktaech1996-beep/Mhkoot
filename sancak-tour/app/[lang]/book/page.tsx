import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getExtras, getPublishedTours, getSettings } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { minBookableDate } from "@/lib/availability";
import { paymentAvailability } from "@/lib/payments";
import { PageHero } from "@/components/PageHero";
import { BookingForm } from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  return { ...pageMeta({ lang, path: "/book", title: d.booking.title, description: d.booking.subtitle }), robots: { index: false, follow: true } };
}

export default function BookPage({ params, searchParams }: { params: { lang: string }; searchParams: Record<string, string | undefined> }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const settings = getSettings();
  const t = { ...d.booking, ...d.common, ...d.footer, title: d.booking.title, date: d.booking.date, tour: d.booking.tour, sampleNote: d.common.sampleNote, errorGeneric: d.common.errorGeneric, maxGroup: d.tourDetail.maxGroup, whatsappCta: d.common.whatsappCta } as Record<string, string>;
  const num = (v?: string, def = 0) => { const n = parseInt(v || "", 10); return Number.isFinite(n) && n >= 0 && n <= 20 ? n : def; };
  return (
    <>
      <PageHero eyebrow={d.nav.book} title={d.booking.title} subtitle={d.booking.subtitle} scene="mostar" />
      <section className="section !pt-10">
        <div className="container-x">
          <BookingForm
            lang={lang} minDate={minBookableDate()} waNumber={settings.whatsappNumber}
            pay={paymentAvailability(settings)}
            tours={getPublishedTours().map((x) => ({ id: x.id, slug: x.slug, title: tr(x.title, lang), priceGroup: x.priceGroup, pricePrivate: x.pricePrivate, privateMaxPax: x.privateMaxPax, childDiscountPct: x.childDiscountPct, maxGroup: x.maxGroup, weekdays: x.weekdays, blackout: x.blackout }))}
            extras={getExtras().map((e) => ({ id: e.id, label: tr(e.label, lang), price: e.price, perPerson: e.perPerson }))}
            initial={{ tour: searchParams.tour, date: searchParams.date, adults: Math.max(1, num(searchParams.adults, 2)), children: num(searchParams.children, 0) }}
            t={t}
            waT={{ msg: d.wa.tourMsg, tour: d.wa.tour, date: d.wa.date, travelers: d.wa.travelers, lang: d.wa.lang, datePending: d.wa.datePending, langName: d.wa.langName }}
          />
        </div>
      </section>
    </>
  );
}
