import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, Eye, Leaf } from "lucide-react";
import { isLang, tr, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getSettings } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Scene } from "@/components/Scene";
import { Reveal } from "@/components/Reveal";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  const o = getSettings().seo.about;
  return pageMeta({ lang, path: "/about", title: o ? tr(o.title, lang) || d.about.title : d.about.title, description: o ? tr(o.description, lang) || d.about.lead : d.about.lead });
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const icons = [Heart, Eye, Leaf];
  return (
    <>
      <PageHero eyebrow={d.nav.about} title={d.about.title} subtitle={d.about.lead} scene="sarajevo" />
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal><div className="space-y-5 text-lg leading-[1.8] text-charcoal/90">{d.about.p.map((p) => <p key={p}>{p}</p>)}
            <p className="rounded-2xl bg-gold/20 p-4 text-sm text-forest">{d.about.pending}</p></div></Reveal>
          <Reveal delay={120}><div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift"><Scene kind="travnik" className="h-full w-full" /></div></Reveal>
        </div>
        <div className="container-x mt-16 grid gap-5 md:grid-cols-3">
          {d.about.values.map((v, i) => { const Icon = icons[i]; return (
            <Reveal key={v.t} delay={i * 100}><div className="h-full rounded-3xl bg-white p-8 shadow-card"><Icon size={28} className="text-gold-600" aria-hidden /><h2 className="mt-4 font-display text-2xl font-semibold text-forest">{v.t}</h2><p className="mt-2 text-charcoal-500">{v.d}</p></div></Reveal>); })}
        </div>
      </section>
    </>
  );
}
