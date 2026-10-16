"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANG_META, LOCALES, LOCALE_COOKIE, type Lang } from "@/lib/i18n/config";

export function swapLangInPath(pathname: string, to: Lang) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

export function LangSwitcher({ lang, label, onLight }: { lang: Lang; label: string; onLight: boolean }) {
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);

  const remember = (l: Lang) => {
    try { document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`; localStorage.setItem("lang", l); } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition ${onLight ? "border-forest/20 text-forest hover:bg-forest hover:text-ivory" : "border-white/35 text-white hover:bg-white hover:text-forest"}`}
      >
        <Globe size={16} aria-hidden />
        <span>{LANG_META[lang].name}</span>
        <ChevronDown size={14} aria-hidden className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="absolute end-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl bg-white py-1.5 shadow-lift ring-1 ring-black/5">
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === lang}>
              <a
                href={swapLangInPath(pathname, l)}
                hrefLang={LANG_META[l].hreflang}
                lang={l}
                onClick={() => remember(l)}
                className={`flex min-h-[44px] items-center justify-between px-4 text-sm text-charcoal transition hover:bg-ivory ${l === lang ? "font-semibold text-forest" : ""}`}
              >
                <span>{LANG_META[l].name}</span>
                {l === lang && <Check size={16} className="text-olive-700" aria-hidden />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
