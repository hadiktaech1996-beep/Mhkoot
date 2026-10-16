import Link from "next/link";
import { Instagram } from "../Icons";
import { ArrowRight, Check, Compass, Languages, MessagesSquare, Play, Route, Star, Plane, BedDouble, Mail, Clock } from "lucide-react";
import type { Lang } from "@/lib/i18n/config";
import { LANG_META, tr } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import type { Post, Settings, Tour, Accommodation } from "@/lib/types";
import { DEST_KEYS, DESTINATIONS } from "@/lib/data/destinations";
import { DEMO_REVIEWS } from "@/lib/data/seed-content";
import { minBookableDate } from "@/lib/availability";
import { fmtEUR } from "@/lib/pricing";
import { Media, Scene } from "../Scene";
import { Reveal } from "../Reveal";
import { DemoBadge, SectionHeading, TourCard } from "../ui";
import { HeroSearch } from "./HeroSearch";
import { WaLink } from "../WaLink";
import { RequestForm } from "../RequestForm";
import { contactFields } from "@/lib/forms";

export function Hero({ lang, d, settings, wa }: { lang: Lang; d: Dict; settings: Settings; wa: string }) {
  const h = d.hero;
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-forest-900 pb-10 pt-[calc(var(--header-h)+40px)] sm:pb-14">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {settings.heroVideo ? (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={settings.heroImage || undefined} preload="metadata"><source src={settings.heroVideo} /></video>
        ) : (
          <Media kind="mostar" src={settings.heroImage} alt="" className="h-full w-full" animate eager />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/55 via-forest-900/5 to-forest-900/80" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,25,20,.55),transparent_65%)] rtl:bg-[linear-gradient(270deg,rgba(12,25,20,.55),transparent_65%)]" />
      </div>
      <div className="container-x">
        <div className="max-w-3xl text-white">
          <p className="hero-fade eyebrow !text-gold" style={{ ["--d" as string]: "100ms" }}>{h.eyebrow}</p>
          <h1 className="hero-fade mt-4 font-display text-[2.7rem] font-semibold leading-[1.02] sm:text-6xl lg:text-[5.4rem]" style={{ ["--d" as string]: "250ms" }}>{h.title}</h1>
          <p className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl" style={{ ["--d" as string]: "420ms" }}>{h.subtitle}</p>
          <div className="hero-fade mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "600ms" }}>
            <Link href={`/${lang}/tours`} className="btn-gold !min-h-[54px] px-8 text-base">{h.explore}<ArrowRight size={18} className="flip-rtl" aria-hidden /></Link>
            <WaLink href={wa} className="btn-whatsapp !min-h-[54px] px-7 text-base">{h.whatsapp}</WaLink>
          </div>
        </div>
        <div className="hero-fade mt-12 sm:mt-16" style={{ ["--d" as string]: "800ms" }}>
          <HeroSearch
            lang={lang}
            t={h}
            minDate={minBookableDate()}
            destinations={DEST_KEYS.map((k) => ({ value: k, label: tr(DESTINATIONS[k].name, lang) }))}
            categories={(["sarajevo", "mostar", "kravice", "travnik", "nature", "family", "private", "vip", "multiday", "balkan"] as const).map((k) => ({ value: k, label: d.cat[k] }))}
          />
          {!settings.heroImage && !settings.heroVideo && <p className="mt-3 text-center text-xs text-white/60">{h.imageNote}</p>}
        </div>
      </div>
    </section>
  );
}

export function Why({ d }: { d: Dict }) {
  const icons = [Compass, Route, Languages, MessagesSquare];
  return (
    <section className="section">
      <div className="container-x">
        <Reveal><SectionHeading eyebrow="Sancak Tour" title={d.why.title} subtitle={d.why.subtitle} /></Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.why.items.map((it, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={it.t} delay={i * 90}>
                <div className="group h-full rounded-3xl border border-forest/10 bg-white p-7 transition duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-card">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-gold transition group-hover:bg-gold group-hover:text-forest"><Icon size={26} aria-hidden /></span>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-forest">{it.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{it.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Destinations({ lang, d, tours }: { lang: Lang; d: Dict; tours: Tour[] }) {
  const keys = ["sarajevo", "mostar", "kravice", "blagaj", "travnik", "jajce", "una", "bjelasnica"] as const;
  const span = ["lg:col-span-2 lg:row-span-2", "", "", "", "", "", "lg:col-span-2", ""];
  return (
    <section className="section bg-ivory-200/60">
      <div className="container-x">
        <Reveal><SectionHeading center eyebrow="Bosnia & Herzegovina" title={d.dest.title} subtitle={d.dest.subtitle} /></Reveal>
        <div className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px]">
          {keys.map((k, i) => {
            const dest = DESTINATIONS[k];
            const count = tours.filter((t) => t.destination === k || (k === "mostar" && t.destination === "blagaj")).length;
            return (
              <Reveal key={k} delay={i * 70} className={span[i]}>
                <Link href={`/${lang}/tours?dest=${k}`} className="group relative block h-full overflow-hidden rounded-3xl">
                  <Scene kind={dest.scene} className="absolute inset-0 h-full w-full transition duration-[1100ms] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <h3 className="font-display text-3xl font-semibold">{tr(dest.name, lang)}</h3>
                    <p className="mt-1 line-clamp-2 max-w-sm text-sm text-white/80 opacity-0 transition duration-500 group-hover:opacity-100 max-lg:opacity-100">{tr(dest.blurb, lang)}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold">{count > 0 ? `${d.dest.toursCount}: ${count}` : d.dest.explore}<ArrowRight size={14} className="flip-rtl transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden /></span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Featured({ lang, d, tours }: { lang: Lang; d: Dict; tours: Tour[] }) {
  const list = tours.filter((t) => t.featured).slice(0, 6);
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><SectionHeading eyebrow="★" title={d.featured.title} subtitle={d.featured.subtitle} /></Reveal>
          <Link href={`/${lang}/tours`} className="btn-ghost">{d.common.viewAll}<ArrowRight size={16} className="flip-rtl" aria-hidden /></Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => <Reveal key={t.id} delay={(i % 3) * 100}><TourCard tour={t} lang={lang} d={d} /></Reveal>)}
        </div>
        {list.some((t) => t.sample) && <p className="mt-6 text-center text-xs text-charcoal-400">{d.common.sampleNote}</p>}
      </div>
    </section>
  );
}

export function VipSection({ lang, d }: { lang: Lang; d: Dict }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 py-20 text-ivory sm:py-28">
      <div className="absolute -end-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow !text-gold">{d.vipHome.eyebrow}</p>
          <h2 className="h-section mt-3 !text-ivory">{d.vipHome.title}</h2>
          <p className="lead mt-5 !text-ivory/75">{d.vipHome.text}</p>
          <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
            {d.vipHome.items.map((it) => (
              <li key={it} className="flex items-start gap-3 text-[15px]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-forest-900"><Check size={14} strokeWidth={3} aria-hidden /></span>{it}</li>
            ))}
          </ul>
          <Link href={`/${lang}/vip`} className="btn-gold mt-10">{d.vipHome.cta}<ArrowRight size={18} className="flip-rtl" aria-hidden /></Link>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-white/10 sm:aspect-[5/5]"><Scene kind="night" className="h-full w-full" /></div>
            <div className="absolute -bottom-6 start-6 end-6 rounded-2xl bg-ivory p-5 text-forest shadow-lift sm:end-auto sm:w-72">
              <p className="eyebrow">{d.cat.vip}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{d.vip.items[0].t}</p>
              <p className="mt-1 text-sm text-charcoal-500">{d.vip.items[1].d}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TransfersSection({ lang, d }: { lang: Lang; d: Dict }) {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift"><Scene kind="road" className="h-full w-full" />
            <div className="absolute start-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-forest backdrop-blur"><Plane size={16} aria-hidden />SJJ · TZL · OMO</div>
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2" delay={120}>
          <p className="eyebrow">{d.nav.transfers}</p>
          <h2 className="h-section mt-3">{d.transfersHome.title}</h2>
          <p className="lead mt-5">{d.transfersHome.text}</p>
          <ul className="mt-6 flex flex-wrap gap-2">{d.transfers.airports.slice(0, 3).map((a) => <li key={a} className="chip">{a}</li>)}</ul>
          <Link href={`/${lang}/transfers`} className="btn-primary mt-9">{d.transfersHome.cta}<ArrowRight size={18} className="flip-rtl" aria-hidden /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function StaySection({ lang, d, stays }: { lang: Lang; d: Dict; stays: Accommodation[] }) {
  return (
    <section className="section bg-ivory-200/60">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><SectionHeading eyebrow={d.nav.stay} title={d.stayHome.title} subtitle={d.stayHome.text} /></Reveal>
          <Link href={`/${lang}/accommodation`} className="btn-ghost">{d.stayHome.cta}<ArrowRight size={16} className="flip-rtl" aria-hidden /></Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stays.slice(0, 3).map((s, i) => (
            <Reveal key={s.id} delay={i * 100}>
              <Link href={`/${lang}/accommodation#${s.slug}`} className="group card block hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden"><Media kind={s.scene} src={s.imageUrl} alt="" className="h-full w-full transition duration-700 group-hover:scale-110" />
                  <div className="absolute start-3 top-3 flex gap-1.5"><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest">{d.stay.types[s.type]}</span>{s.sample && <DemoBadge label={d.common.sample} />}</div></div>
                <div className="p-5"><h3 className="font-display text-2xl font-semibold text-forest">{tr(s.name, lang)}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-charcoal-500"><BedDouble size={15} aria-hidden />{d.stay.locations[s.location]} · {s.guests} {d.common.guests}</p>
                  <p className="mt-3 text-sm text-charcoal-400">{d.common.from} <b className="font-display text-xl text-forest">{fmtEUR(s.pricePerNight, lang)}</b> {d.common.perNight} <span className="text-xs">({d.common.priceSample})</span></p></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Packages({ lang, d, tours }: { lang: Lang; d: Dict; tours: Tour[] }) {
  const list = tours.filter((t) => t.categories.includes("multiday")).slice(0, 3);
  if (!list.length) return null;
  return (
    <section className="section">
      <div className="container-x">
        <Reveal><SectionHeading center eyebrow={d.cat.multiday} title={d.packages.title} subtitle={d.packages.subtitle} /></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => <Reveal key={t.id} delay={i * 100}><TourCard tour={t} lang={lang} d={d} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export function Inspiration({ lang, d, posts }: { lang: Lang; d: Dict; posts: Post[] }) {
  return (
    <section className="section bg-ivory-200/60">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><SectionHeading eyebrow={d.nav.blog} title={d.inspiration.title} subtitle={d.inspiration.subtitle} /></Reveal>
          <Link href={`/${lang}/blog`} className="btn-ghost">{d.inspiration.all}<ArrowRight size={16} className="flip-rtl" aria-hidden /></Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 100}><PostCard post={p} lang={lang} d={d} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post, lang, d }: { post: Post; lang: Lang; d: Dict }) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="group card block h-full hover:-translate-y-1.5 hover:shadow-lift">
      <div className="aspect-[16/10] overflow-hidden"><Media kind={post.scene} src={post.imageUrl} alt="" className="h-full w-full transition duration-700 group-hover:scale-110" /></div>
      <div className="p-6">
        <p className="eyebrow">{d.blog.cats[post.category as keyof Dict["blog"]["cats"]] || post.category} · {post.readMin} {d.blog.min}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-forest">{tr(post.title, lang)}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal-500">{tr(post.excerpt, lang)}</p>
      </div>
    </Link>
  );
}

export function Reviews({ lang, d, settings }: { lang: Lang; d: Dict; settings: Settings }) {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal><SectionHeading center eyebrow="★ ★ ★ ★ ★" title={d.reviews.title} /></Reveal>
        {settings.showDemoReviews ? (
          <>
            <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 text-center"><DemoBadge label={d.reviews.demoLabel} /><p className="text-sm text-charcoal-500">{d.reviews.demoNote}</p></div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {DEMO_REVIEWS.map((r, i) => (
                <Reveal key={r.id} delay={i * 100}>
                  <figure className="h-full rounded-3xl bg-white p-7 opacity-95 shadow-card ring-1 ring-dashed ring-gold/60">
                    <div className="flex gap-0.5 text-gold" aria-hidden>{Array.from({ length: r.stars }).map((_, k) => <Star key={k} size={16} fill="currentColor" />)}</div>
                    <blockquote className="mt-4 font-display text-xl leading-snug text-forest">“{tr(r.text, lang)}”</blockquote>
                    <figcaption className="mt-5 text-xs font-semibold uppercase tracking-widest text-charcoal-400">{d.common.sample} · {r.country}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-forest/25 p-10 text-center"><h3 className="font-display text-2xl font-semibold text-forest">{d.reviews.emptyTitle}</h3><p className="mt-2 text-charcoal-500">{d.reviews.emptyText}</p></div>
        )}
      </div>
    </section>
  );
}

export function InstagramSection({ d, settings }: { d: Dict; settings: Settings }) {
  const url = settings.social.instagram || "https://www.instagram.com/sancaktours/";
  const kinds = ["mostar", "kravice", "sarajevo", "blagaj"] as const;
  return (
    <section className="section bg-forest text-ivory">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><SectionHeading light eyebrow="@sancaktours" title={d.insta.title} subtitle={d.insta.subtitle} /></Reveal>
          <a href={url} target="_blank" rel="noopener noreferrer me" className="btn-gold"><Instagram size={18} aria-hidden />{d.insta.follow}</a>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kinds.map((k, i) => (
            <Reveal key={k} as="li" delay={i * 80}>
              <a href={url} target="_blank" rel="noopener noreferrer me" className="group relative block aspect-square overflow-hidden rounded-2xl">
                <Scene kind={k} className="h-full w-full transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent p-4 text-sm font-medium text-white">{d.insta.cards[i]}</span>
                <span className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest opacity-0 transition group-hover:opacity-100"><Instagram size={16} aria-hidden /><span className="sr-only">{d.insta.openPost}</span></span>
              </a>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 grid items-center gap-8 rounded-3xl bg-forest-900/60 p-6 sm:p-8 lg:grid-cols-[auto_1fr]">
          <div className="flex gap-3" aria-hidden>
            {[0, 1, 2].map((i) => <div key={i} className="relative aspect-[9/16] w-24 overflow-hidden rounded-2xl bg-forest-700 sm:w-28"><Scene kind={(["road", "una", "night"] as const)[i]} className="h-full w-full opacity-70" /><span className="absolute inset-0 flex items-center justify-center"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-forest"><Play size={16} fill="currentColor" /></span></span></div>)}
          </div>
          <div><h3 className="font-display text-2xl font-semibold">{d.insta.reelsTitle}</h3><p className="mt-2 text-sm text-ivory/70">{d.insta.reelsText}</p><p className="mt-3 text-xs text-ivory/50">{d.insta.note}</p></div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ d }: { d: Dict }) {
  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal><SectionHeading eyebrow="FAQ" title={d.faq.title} /></Reveal>
        <div className="space-y-3">
          {d.faq.items.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white shadow-card open:ring-1 open:ring-gold/50">
              <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-display text-xl font-semibold text-forest [&::-webkit-details-marker]:hidden">
                {f.q}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-200 text-lg transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-charcoal-500">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ lang, d, settings, wa }: { lang: Lang; d: Dict; settings: Settings; wa: string }) {
  return (
    <section className="section bg-ivory-200/60" id="contact">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow={d.nav.contact} title={d.contactHome.title} subtitle={d.contactHome.subtitle} />
          <ul className="mt-8 space-y-4">
            <li><WaLink href={wa} className="btn-whatsapp">{d.contactHome.whatsapp}</WaLink></li>
            {settings.company.email && <li className="flex items-center gap-3 text-forest"><Mail size={18} aria-hidden /><a href={`mailto:${settings.company.email}`} className="underline underline-offset-4">{settings.company.email}</a></li>}
            <li className="flex items-center gap-3 text-sm text-charcoal-500"><Clock size={18} aria-hidden />{d.contactHome.hours}</li>
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-9">
            <h3 className="font-display text-2xl font-semibold text-forest">{d.contactHome.quick}</h3>
            <RequestForm type="contact" lang={lang} fields={contactFields(d, false)} labels={{ submit: d.common.send, success: d.contactPage.success, successNote: d.common.sentNote, consent: d.common.consentLabel, privacy: d.common.privacyLink, error: d.common.errorGeneric, ref: d.common.ref, required: d.common.required }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
