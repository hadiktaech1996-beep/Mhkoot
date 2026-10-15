import type { MetadataRoute } from "next";
import { LANG_META, LOCALES } from "@/lib/i18n/config";
import { getPublishedPosts, getPublishedTours } from "@/lib/store";
import { SITE_URL } from "@/lib/seo";

const STATIC = ["", "/tours", "/transfers", "/accommodation", "/vip", "/blog", "/about", "/contact", "/legal/privacy", "/legal/cookies", "/legal/terms", "/legal/booking-conditions", "/legal/cancellation", "/legal/imprint"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC.map((p) => ({ p, priority: p === "" ? 1 : 0.7, lastModified: undefined as Date | undefined })),
    ...getPublishedTours().map((t) => ({ p: `/tours/${t.slug}`, priority: 0.9, lastModified: undefined })),
    ...getPublishedPosts().map((b) => ({ p: `/blog/${b.slug}`, priority: 0.6, lastModified: new Date(b.date) })),
  ];
  return paths.flatMap(({ p, priority, lastModified }) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${p}`, lastModified, changeFrequency: "weekly" as const, priority,
      alternates: { languages: { ...Object.fromEntries(LOCALES.map((l) => [LANG_META[l].hreflang, `${SITE_URL}/${l}${p}`])), "x-default": `${SITE_URL}/en${p}` } },
    })),
  );
}
