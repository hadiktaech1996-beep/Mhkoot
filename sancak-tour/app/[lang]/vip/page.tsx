import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Car, Compass, Crown, Map, Plane, UserRound, Users } from "lucide-react";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getSettings } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { waHref } from "@/lib/whatsapp";
import { vipFields } from "@/lib/forms";
import { PageHero } from "@/components/PageHero";
import { RequestForm } from "@/components/RequestForm";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import { WaLink } from "@/components/WaLink";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.vip;
  return pageMeta({ lang, path: "/vip", title: o ? tr(o.title, lang) || d.vip.title : d.vip.title, description: o ? tr(o.description, lang) || d.vip.subtitle : d.vip.subtitle });
}

export default function VipPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const icons = [Car, Crown, Map, UserRound, Plane, BedDouble, Users, Compass];
  const wa = waHref(getSettings().whatsappNumber, d.wa.vipMsg, lang);
  return (
    <>
      <PageHero eyebrow={d.nav.vip} title={d.vip.title} subtitle={d.vip.subtitle} scene="night" />
      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.vip.items.map((it, i) => { const Icon = icons[i]; return (
            <Reveal key={it.t} delay={(i % 4) * 80}><div className="group h-full rounded-3xl bg-forest p-7 text-ivory transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-forest-900"><Icon size={22} aria-hidden /></span>
              <h2 className="mt-6 font-display text-2xl font-semibold">{it.t}</h2><p className="mt-2 text-sm text-ivory/70">{it.d}</p></div></Reveal>); })}
        </div>
      </section>
      <section className="section bg-ivory-200/60" id="plan">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal><SectionHeading eyebrow={d.nav.vip} title={d.vip.formTitle} subtitle={d.vip.subtitle} /><WaLink href={wa} className="btn-whatsapp mt-8">{d.common.whatsappCta}</WaLink></Reveal>
          <Reveal delay={100}><div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-9">
            <RequestForm type="vip" lang={lang} fields={vipFields(d)} labels={{ submit: d.vip.submit, success: d.vip.success, successNote: d.common.sentNote, consent: d.common.consentLabel, privacy: d.common.privacyLink, error: d.common.errorGeneric, ref: d.common.ref, required: d.common.required }} />
          </div></Reveal>
        </div>
      </section>
    </>
  );
}
