import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getPublishedPosts, getPublishedStays, getPublishedTours, getSettings } from "@/lib/store";
import { waHref } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ContactSection, Destinations, FaqSection, Featured, Hero, InstagramSection, Inspiration, Packages, Reviews, StaySection, TransfersSection, VipSection, Why } from "@/components/home/sections";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.home;
  return pageMeta({ lang, path: "/", title: o ? tr(o.title, lang) || d.meta.title : d.meta.title, description: o ? tr(o.description, lang) || d.meta.description : d.meta.description });
}

export default function Home({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const settings = getSettings();
  const tours = getPublishedTours();
  const show = settings.homepage;
  const wa = waHref(settings.whatsappNumber, d.wa.generalMsg, lang);

  return (
    <>
      <Hero lang={lang} d={d} settings={settings} wa={wa} />
      {show.why !== false && <Why d={d} />}
      {show.destinations !== false && <Destinations lang={lang} d={d} tours={tours} />}
      {show.featured !== false && <Featured lang={lang} d={d} tours={tours} />}
      {show.vip !== false && <VipSection lang={lang} d={d} />}
      {show.transfers !== false && <TransfersSection lang={lang} d={d} />}
      {show.stay !== false && <StaySection lang={lang} d={d} stays={getPublishedStays()} />}
      {show.packages !== false && <Packages lang={lang} d={d} tours={tours} />}
      {show.inspiration !== false && <Inspiration lang={lang} d={d} posts={getPublishedPosts()} />}
      {show.reviews !== false && <Reviews lang={lang} d={d} settings={settings} />}
      {show.instagram !== false && <InstagramSection d={d} settings={settings} />}
      {show.faq !== false && <FaqSection d={d} />}
      {show.contact !== false && <ContactSection lang={lang} d={d} settings={settings} wa={wa} />}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
