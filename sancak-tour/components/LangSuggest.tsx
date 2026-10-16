"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Languages, X } from "lucide-react";
import { LANG_META, LOCALES, LOCALE_COOKIE, isLang, type Lang } from "@/lib/i18n/config";
import { swapLangInPath } from "./LangSwitcher";

type Strings = Record<Lang, { text: string; go: string; dismiss: string }>;

/** Suggests the browser language without ever redirecting. Silent if the visitor already chose a language. */
export function LangSuggest({ lang, strings }: { lang: Lang; strings: Strings }) {
  const pathname = usePathname() || `/${lang}`;
  const [target, setTarget] = useState<Lang | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("lang-suggest-dismissed") || localStorage.getItem("lang") || document.cookie.includes(`${LOCALE_COOKIE}=`)) return;
    } catch {}
    for (const raw of navigator.languages || [navigator.language]) {
      const code = raw.toLowerCase().slice(0, 2);
      if (isLang(code)) { if (code !== lang) setTarget(code); return; }
    }
  }, [lang]);

  if (!target || !LOCALES.includes(target)) return null;
  const s = strings[target];
  const dismiss = () => { try { sessionStorage.setItem("lang-suggest-dismissed", "1"); } catch {} setTarget(null); };
  return (
    <div role="region" aria-label="Language" dir={LANG_META[target].dir} lang={target} className="fixed inset-x-3 top-[calc(var(--header-h)+8px)] z-[45] mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-forest px-4 py-3 text-sm text-ivory shadow-lift">
      <Languages size={20} className="shrink-0 text-gold" aria-hidden />
      <p className="flex-1">{s.text}</p>
      <a href={swapLangInPath(pathname, target)} hrefLang={target} onClick={() => { try { localStorage.setItem("lang", target); document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`; } catch {} }} className="rounded-full bg-gold px-4 py-2 font-semibold text-forest-900">{s.go} {LANG_META[target].name}</a>
      <button type="button" onClick={dismiss} aria-label={s.dismiss} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"><X size={16} /></button>
    </div>
  );
}
