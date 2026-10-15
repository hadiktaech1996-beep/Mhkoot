export const LOCALES = ["ar", "tr", "en", "de"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "en";

export const LANG_META: Record<Lang, { name: string; short: string; dir: "ltr" | "rtl"; hreflang: string; og: string }> = {
  ar: { name: "العربية", short: "AR", dir: "rtl", hreflang: "ar", og: "ar_AR" },
  tr: { name: "Türkçe", short: "TR", dir: "ltr", hreflang: "tr", og: "tr_TR" },
  en: { name: "English", short: "EN", dir: "ltr", hreflang: "en", og: "en_US" },
  de: { name: "Deutsch", short: "DE", dir: "ltr", hreflang: "de", og: "de_DE" },
};

export function isLang(v: string | undefined | null): v is Lang {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

/** A string translated into all four site languages. */
export type L = Record<Lang, string>;
export type LList = Record<Lang, string[]>;

export function tr(l: L | undefined, lang: Lang): string {
  if (!l) return "";
  return l[lang] || l.en || "";
}
export function trList(l: LList | undefined, lang: Lang): string[] {
  if (!l) return [];
  return l[lang]?.length ? l[lang] : l.en || [];
}

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function detectFromAcceptLanguage(header: string | null | undefined): Lang | null {
  if (!header) return null;
  for (const part of header.split(",")) {
    const code = part.trim().split(";")[0].toLowerCase().slice(0, 2);
    if (isLang(code)) return code;
  }
  return null;
}
