import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { isLang, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { readDb } from "@/lib/store";
import { fmtEUR } from "@/lib/pricing";
import { PageHero } from "@/components/PageHero";
import { WaLink } from "@/components/WaLink";
import { waHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Confirmation({ params, searchParams }: { params: { lang: string }; searchParams: { id?: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const db = readDb();
  const b = db.bookings.find((x) => x.id === searchParams.id);
  if (!b) notFound();
  return (
    <>
      <PageHero title={d.booking.success} scene="kravice" />
      <section className="section !pt-10">
        <div className="container-x max-w-2xl">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-card sm:p-12">
            <CheckCircle2 size={56} className="mx-auto text-olive-700" aria-hidden />
            <p className="mt-4 text-charcoal-500">{d.booking.successText}</p>
            <dl className="mx-auto mt-8 max-w-sm space-y-3 text-start text-sm">
              <div className="flex justify-between gap-4"><dt className="text-charcoal-400">{d.common.ref}</dt><dd className="font-mono font-bold text-forest">{b.ref}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-400">{d.booking.tour}</dt><dd className="font-semibold">{b.tourTitle}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-400">{d.booking.date}</dt><dd className="font-semibold" dir="ltr">{b.date}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-400">{d.common.total}</dt><dd className="font-semibold">{fmtEUR(b.total, lang)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-400">{d.booking.status}</dt><dd className="chip">{d.status[b.status]}</dd></div>
            </dl>
            <p className="mt-6 text-xs text-charcoal-400">{d.booking.emailNote}</p>
            {b.sample && <p className="mt-2 text-xs text-gold-700">{d.email.demoNote}</p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`/${lang}`} className="btn-primary">{d.errors.home}</Link>
              <WaLink href={waHref(db.settings.whatsappNumber, `${d.wa.tourMsg}\n${d.common.ref}: ${b.ref}`, lang)}>{d.common.whatsappCta}</WaLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
