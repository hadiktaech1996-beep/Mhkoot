import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import type { Lang } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import type { Tour } from "@/lib/types";
import { DESTINATIONS } from "@/lib/data/destinations";
import { displayPrice, fmtEUR } from "@/lib/pricing";
import { durationLabel } from "@/lib/format";
import { Media } from "./Scene";

export function SectionHeading({ eyebrow, title, subtitle, center = false, light = false }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && <p className={`eyebrow ${light ? "!text-gold" : ""}`}>{eyebrow}</p>}
      <h2 className={`h-section mt-3 ${light ? "!text-ivory" : ""}`}>{title}</h2>
      {subtitle && <p className={`lead mt-4 ${light ? "!text-ivory/75" : ""}`}>{subtitle}</p>}
    </div>
  );
}

export function DemoBadge({ label }: { label: string }) {
  return <span className="demo-badge">{label}</span>;
}

export function PriceTag({ tour, d, lang, size = "md" }: { tour: Pick<Tour, "priceGroup" | "pricePrivate">; d: Dict; lang: Lang; size?: "md" | "lg" }) {
  const p = displayPrice(tour);
  if (!p) return <span className="font-semibold text-forest">{d.common.onRequest}</span>;
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-xs text-charcoal-400">{d.common.from}</span>
      <span className={`font-display font-bold text-forest ${size === "lg" ? "text-4xl" : "text-2xl"}`}>{fmtEUR(p.amount, lang)}</span>
      <span className="text-xs text-charcoal-400">{p.unit === "person" ? d.common.perPerson : d.common.perGroup}</span>
    </span>
  );
}

export function TourCard({ tour, lang, d, priority = false }: { tour: Tour; lang: Lang; d: Dict; priority?: boolean }) {
  const href = `/${lang}/tours/${tour.slug}`;
  const dest = DESTINATIONS[tour.destination];
  const title = tr(tour.title, lang);
  return (
    <article className="group card relative flex h-full flex-col hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Media kind={tour.scene} src={tour.imageUrl} alt="" className="h-full w-full transition duration-[900ms] ease-out group-hover:scale-110" eager={priority} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest backdrop-blur">{d.cat[tour.categories[0]]}</span>
          {tour.sample && <DemoBadge label={d.common.sample} />}
        </div>
        <div className="absolute bottom-3 start-4 flex items-center gap-1.5 text-sm font-medium text-white">
          <MapPin size={15} aria-hidden />{tr(dest.name, lang)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-2xl font-semibold leading-snug text-forest">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:after:rounded-3xl">{title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-500">{tr(tour.summary, lang)}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-charcoal-500">
          <span className="flex items-center gap-1.5"><Clock size={14} aria-hidden />{durationLabel(tour, d)}</span>
          <span className="flex items-center gap-1.5"><Users size={14} aria-hidden />{d.tourDetail.upTo} {tour.maxGroup}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <PriceTag tour={tour} d={d} lang={lang} />
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-ivory transition group-hover:bg-gold group-hover:text-forest-900" aria-hidden>
            <ArrowRight size={18} className="flip-rtl" />
          </span>
        </div>
      </div>
    </article>
  );
}
