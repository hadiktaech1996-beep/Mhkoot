import type { Metadata } from "next";
import { LANG_META, LOCALES, type Lang } from "./i18n/config";

export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export function alternates(lang: Lang, pathname: string): Metadata["alternates"] {
  const p = pathname === "/" ? "" : pathname;
  return {
    canonical: `${SITE_URL}/${lang}${p}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [LANG_META[l].hreflang, `${SITE_URL}/${l}${p}`])),
      "x-default": `${SITE_URL}/en${p}`,
    },
  };
}

export function pageMeta(opts: { lang: Lang; path: string; title: string; description: string; image?: string; type?: "website" | "article" }): Metadata {
  const url = `${SITE_URL}/${opts.lang}${opts.path === "/" ? "" : opts.path}`;
  const image = opts.image || `${SITE_URL}/og`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: alternates(opts.lang, opts.path),
    openGraph: {
      title: opts.title, description: opts.description, url, siteName: "Sancak Tour", type: opts.type || "website",
      locale: LANG_META[opts.lang].og, alternateLocale: LOCALES.filter((l) => l !== opts.lang).map((l) => LANG_META[l].og),
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}
