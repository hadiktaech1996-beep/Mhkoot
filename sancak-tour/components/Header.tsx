"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Lang } from "@/lib/i18n/config";
import { Logo } from "./Logo";
import { WaLink } from "./WaLink";
import { LangSwitcher } from "./LangSwitcher";

export interface NavLabels {
  home: string; tours: string; transfers: string; stay: string; vip: string; blog: string; about: string; contact: string;
  book: string; menu: string; close: string; language: string; skip: string; whatsapp: string; siteName: string;
}

export function Header({ lang, nav, waHref }: { lang: Lang; nav: NavLabels; waHref: string }) {
  const pathname = usePathname() || "";
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
  }, [open]);

  const solid = scrolled || !isHome || open;
  const links: [string, string][] = [
    [`/${lang}/tours`, nav.tours], [`/${lang}/transfers`, nav.transfers], [`/${lang}/accommodation`, nav.stay],
    [`/${lang}/vip`, nav.vip], [`/${lang}/blog`, nav.blog], [`/${lang}/about`, nav.about], [`/${lang}/contact`, nav.contact],
  ];

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-semibold focus:text-forest-900">{nav.skip}</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? "bg-ivory/90 shadow-[0_1px_0_rgba(23,33,43,.08)] backdrop-blur-xl" : "bg-gradient-to-b from-black/45 to-transparent"}`} style={{ height: "var(--header-h)" }}>
        <div className="container-x flex h-full items-center justify-between gap-4">
          <Link href={`/${lang}`} aria-label={`${nav.siteName} – ${nav.home}`} className="shrink-0"><Logo light={!solid} name={nav.siteName} /></Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {links.map(([href, label]) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition hover:after:scale-x-100 ${active ? "after:scale-x-100" : ""} ${solid ? "text-forest" : "text-white"}`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LangSwitcher lang={lang} label={nav.language} onLight={solid} /></div>
            <WaLink href={waHref} className="btn-whatsapp !min-h-[44px] !px-4 hidden md:inline-flex" label={nav.whatsapp}><span className="hidden 2xl:inline">{nav.whatsapp}</span></WaLink>
            <Link href={`/${lang}/book`} className="btn-gold !min-h-[44px] !px-5 hidden lg:inline-flex">{nav.book}</Link>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? nav.close : nav.menu}
              className={`flex h-11 w-11 items-center justify-center rounded-full border xl:hidden ${solid ? "border-forest/20 text-forest" : "border-white/40 text-white"}`}>
              {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-40 overflow-y-auto bg-forest-900 pt-[calc(var(--header-h)+8px)] text-ivory xl:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-6">
            {links.map(([href, label], i) => (
              <Link key={href} href={href} style={{ animationDelay: `${i * 40}ms` }} className="hero-fade border-b border-white/10 py-4 font-display text-3xl font-semibold">{label}</Link>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${lang}/book`} className="btn-gold">{nav.book}</Link>
              <WaLink href={waHref}>{nav.whatsapp}</WaLink>
            </div>
            <div className="mt-8 sm:hidden"><LangSwitcher lang={lang} label={nav.language} onLight={false} /></div>
          </nav>
        </div>
      )}
    </>
  );
}
