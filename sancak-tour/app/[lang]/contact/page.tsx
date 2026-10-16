import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { Instagram } from "@/components/Icons";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getSettings } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { waHref } from "@/lib/whatsapp";
import { contactFields } from "@/lib/forms";
import { PageHero } from "@/components/PageHero";
import { RequestForm } from "@/components/RequestForm";
import { WaLink } from "@/components/WaLink";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.contact;
  return pageMeta({ lang, path: "/contact", title: o ? tr(o.title, lang) || d.contactPage.title : d.contactPage.title, description: o ? tr(o.description, lang) || d.contactPage.subtitle : d.contactPage.subtitle });
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const s = getSettings();
  const wa = waHref(s.whatsappNumber, d.wa.generalMsg, lang);
  const row = "flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card";
  return (
    <>
      <PageHero eyebrow={d.nav.contact} title={d.contactPage.title} subtitle={d.contactPage.subtitle} scene="mostar" />
      <section className="section !pt-10">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3" id="whatsapp">
            <WaLink href={wa} className="btn-whatsapp w-full !min-h-[56px] text-base">{d.contactHome.whatsapp}</WaLink>
            {s.company.email && <a href={`mailto:${s.company.email}`} className={row}><Mail className="mt-0.5 text-gold-600" size={20} aria-hidden /><span className="font-medium text-forest">{s.company.email}</span></a>}
            {s.company.phone && <a href={`tel:${s.company.phone.replace(/\s/g, "")}`} className={row} dir="ltr"><Phone className="mt-0.5 text-gold-600" size={20} aria-hidden /><span className="font-medium text-forest">{s.company.phone}</span></a>}
            <div className={row}><MapPin className="mt-0.5 shrink-0 text-gold-600" size={20} aria-hidden /><span><b className="block text-xs uppercase tracking-wider text-gold-700">{d.contactPage.address}</b><span className="text-charcoal-500">{s.company.address || d.contactPage.addressPending}</span></span></div>
            {s.social.instagram && <a href={s.social.instagram} target="_blank" rel="noopener noreferrer me" className={row}><Instagram className="mt-0.5 text-gold-600" size={20} aria-hidden /><span className="font-medium text-forest" dir="ltr">@sancaktours</span></a>}
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-9">
            <h2 className="font-display text-3xl font-semibold text-forest">{d.contactPage.form}</h2>
            <RequestForm type="contact" lang={lang} fields={contactFields(d, true)} labels={{ submit: d.common.send, success: d.contactPage.success, successNote: d.common.sentNote, consent: d.common.consentLabel, privacy: d.common.privacyLink, error: d.common.errorGeneric, ref: d.common.ref, required: d.common.required }} />
          </div>
        </div>
      </section>
    </>
  );
}
