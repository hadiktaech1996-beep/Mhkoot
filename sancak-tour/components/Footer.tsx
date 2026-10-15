import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Instagram, Facebook, Youtube } from "./Icons";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { Logo } from "./Logo";
import { WaLink } from "./WaLink";
import { CookieSettingsButton } from "./CookieConsent";

export function Footer({ lang, d, settings, wa }: { lang: Lang; d: Dict; settings: Settings; wa: string }) {
  const col = (title: string, items: [string, string][]) => (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map(([href, label]) => (
          <li key={href}><Link href={href} className="text-sm text-ivory/75 transition hover:text-gold">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
  const s = settings.social;
  return (
    <footer className="relative bg-forest-900 text-ivory">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">{d.footer.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {s.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer me" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:border-gold hover:bg-gold hover:text-forest-900"><Instagram size={18} /></a>}
            {s.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer me" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:border-gold hover:bg-gold hover:text-forest-900"><Facebook size={18} /></a>}
            {s.youtube && <a href={s.youtube} target="_blank" rel="noopener noreferrer me" aria-label="YouTube" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:border-gold hover:bg-gold hover:text-forest-900"><Youtube size={18} /></a>}
            <WaLink href={wa} label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:border-[#1FA855] hover:bg-[#1FA855]" icon={false}><MessageCircle size={18} /></WaLink>
            {settings.company.email && <a href={`mailto:${settings.company.email}`} aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:border-gold hover:bg-gold hover:text-forest-900"><Mail size={18} /></a>}
          </div>
        </div>
        {col(d.footer.explore, [
          [`/${lang}/tours`, d.nav.tours], [`/${lang}/transfers`, d.nav.transfers], [`/${lang}/accommodation`, d.nav.stay],
          [`/${lang}/vip`, d.nav.vip], [`/${lang}/blog`, d.nav.blog],
        ])}
        {col(d.footer.company, [[`/${lang}/about`, d.nav.about], [`/${lang}/contact`, d.nav.contact], [`/${lang}/book`, d.nav.book]])}
        <div>
          {col(d.footer.legal, [
            [`/${lang}/legal/privacy`, d.footer.privacy], [`/${lang}/legal/cookies`, d.footer.cookies], [`/${lang}/legal/terms`, d.footer.terms],
            [`/${lang}/legal/booking-conditions`, d.footer.bookingConditions], [`/${lang}/legal/cancellation`, d.footer.cancellation], [`/${lang}/legal/imprint`, d.footer.imprint],
          ])}
          <div className="mt-3"><CookieSettingsButton label={d.footer.cookieSettings} /></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sancak Tour. {d.footer.rights}</p>
          <p>{d.footer.demoNotice}</p>
        </div>
      </div>
    </footer>
  );
}
