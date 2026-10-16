import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase, Car, Crown, KeyRound, Plane, Route, UserRound, Users } from "lucide-react";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getSettings, getVehicles } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { waHref } from "@/lib/whatsapp";
import { fmtEUR } from "@/lib/pricing";
import { transferFields } from "@/lib/forms";
import { PageHero } from "@/components/PageHero";
import { Media } from "@/components/Scene";
import { RequestForm } from "@/components/RequestForm";
import { Reveal } from "@/components/Reveal";
import { DemoBadge, SectionHeading } from "@/components/ui";
import { WaLink } from "@/components/WaLink";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.transfers;
  return pageMeta({ lang, path: "/transfers", title: o ? tr(o.title, lang) || d.transfers.title : d.transfers.title, description: o ? tr(o.description, lang) || d.transfers.subtitle : d.transfers.subtitle });
}

export default function TransfersPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const settings = getSettings();
  const icons = [Plane, Plane, Plane, UserRound, Route, KeyRound, Crown];
  const wa = waHref(settings.whatsappNumber, d.wa.transferMsg, lang);
  return (
    <>
      <PageHero eyebrow={d.nav.transfers} title={d.transfers.title} subtitle={d.transfers.subtitle} scene="road" />
      <section className="section">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.transfers.services.map((s, i) => { const Icon = icons[i] || Car; return (
              <Reveal key={s.t} delay={(i % 3) * 80}><div className="h-full rounded-3xl border border-forest/10 bg-white p-7 transition hover:-translate-y-1 hover:border-gold hover:shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-gold"><Icon size={22} aria-hidden /></span>
                <h2 className="mt-5 font-display text-2xl font-semibold text-forest">{s.t}</h2><p className="mt-2 text-sm leading-relaxed text-charcoal-500">{s.d}</p></div></Reveal>); })}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-200/60">
        <div className="container-x">
          <Reveal><SectionHeading eyebrow={d.nav.transfers} title={d.transfers.fleet} subtitle={d.transfers.fleetNote} /></Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {getVehicles().map((v, i) => (
              <Reveal key={v.id} delay={i * 80}><article className="card h-full">
                <div className="relative aspect-[4/3]"><Media kind={v.scene} src={v.imageUrl} alt="" className="h-full w-full" /><span className="absolute start-3 top-3"><DemoBadge label={d.common.sample} /></span></div>
                <div className="p-5"><h3 className="font-display text-2xl font-semibold text-forest">{tr(v.name, lang)}</h3><p className="mt-1 text-sm text-charcoal-500">{tr(v.note, lang)}</p>
                  <ul className="mt-4 flex gap-4 text-sm font-medium text-forest"><li className="flex items-center gap-1.5"><Users size={16} aria-hidden />{v.passengers} <span className="sr-only">{d.common.maxPassengers}</span></li><li className="flex items-center gap-1.5"><Briefcase size={16} aria-hidden />{v.suitcases} <span className="sr-only">{d.common.suitcases}</span></li></ul>
                  <p className="mt-4 text-sm text-charcoal-400">{v.priceFrom > 0 ? <>{d.common.from} <b className="font-display text-2xl text-forest">{fmtEUR(v.priceFrom, lang)}</b></> : d.common.onRequest}</p></div>
              </article></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="request">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal><SectionHeading eyebrow={d.nav.transfers} title={d.transfers.formTitle} subtitle={d.transfers.quote} />
            <WaLink href={wa} className="btn-whatsapp mt-8">{d.common.whatsappCta}</WaLink></Reveal>
          <Reveal delay={100}><div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-9">
            <RequestForm type="transfer" lang={lang} fields={transferFields(d)} labels={{ submit: d.transfers.submit, success: d.transfers.success, successNote: d.common.sentNote, consent: d.common.consentLabel, privacy: d.common.privacyLink, error: d.common.errorGeneric, ref: d.common.ref, required: d.common.required }} />
          </div></Reveal>
        </div>
      </section>
    </>
  );
}
