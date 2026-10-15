import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { isLang, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getSettings } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";

const SLUGS = ["privacy", "cookies", "terms", "booking-conditions", "cancellation", "imprint"] as const;
type Slug = (typeof SLUGS)[number];

function content(slug: Slug, d: ReturnType<typeof getDict>) {
  switch (slug) {
    case "privacy": return d.legal.privacy;
    case "cookies": return d.legal.cookies;
    case "terms": return d.legal.terms;
    case "booking-conditions": return d.legal.booking;
    case "cancellation": return d.legal.cancellation;
    case "imprint": return d.legal.imprint;
  }
}

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang) || !SLUGS.includes(params.slug as Slug)) return {};
  const c = content(params.slug as Slug, getDict(lang));
  return { ...pageMeta({ lang, path: `/legal/${params.slug}`, title: c.title, description: c.p[0] }), robots: { index: params.slug !== "imprint" ? true : true, follow: true } };
}

export default function LegalPage({ params }: { params: { lang: string; slug: string } }) {
  if (!isLang(params.lang) || !SLUGS.includes(params.slug as Slug)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const c = content(params.slug as Slug, d);
  const s = getSettings();
  const fields = params.slug === "imprint" ? d.legal.imprint.fields : [];
  const known: Record<number, string> = { 0: s.company.legalInfoPending ? "" : s.company.name, 7: [s.company.email, s.company.phone].filter(Boolean).join(" · "), 2: s.company.address };
  return (
    <>
      <PageHero eyebrow={d.nav.about} title={c.title} scene="travnik" />
      <div className="container-x max-w-3xl py-14">
        {s.company.legalInfoPending && (
          <p className="mb-8 flex items-start gap-3 rounded-2xl border border-gold bg-gold/15 p-4 text-sm text-forest"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />{d.legal.draft}</p>
        )}
        <div className="space-y-5 text-lg leading-[1.8] text-charcoal/90">{c.p.map((p) => <p key={p}>{p}</p>)}</div>
        {fields.length > 0 && (
          <dl className="mt-8 divide-y divide-forest/10 rounded-3xl bg-white shadow-card">
            {fields.map((f, i) => (<div key={f} className="grid gap-1 px-6 py-4 sm:grid-cols-[220px_1fr]"><dt className="text-sm font-semibold text-forest">{f}</dt><dd className={known[i] ? "" : "text-charcoal-400"}>{known[i] || d.legal.pendingValue}</dd></div>))}
          </dl>
        )}
      </div>
    </>
  );
}
