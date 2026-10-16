import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import "@fontsource/cormorant-garamond/latin-ext-600.css";
import "@fontsource/cormorant-garamond/latin-ext-700.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/cairo";
import "../globals.css";
import { LANG_META, LOCALES, isLang, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getSettings } from "@/lib/store";
import { waHref } from "@/lib/whatsapp";
import { SITE_URL, alternates } from "@/lib/seo";
import { DICTS } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WaLink } from "@/components/WaLink";
import { CookieConsent } from "@/components/CookieConsent";
import { LangSuggest } from "@/components/LangSuggest";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#213D32", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const s = getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: `%s | ${d.meta.siteName}` },
    description: d.meta.description,
    alternates: alternates(lang, "/"),
    verification: s.analytics.searchConsole ? { google: s.analytics.searchConsole } : undefined,
    icons: { icon: "/icon.svg" },
    robots: { index: true, follow: true },
  };
}

export default function LangLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const settings = getSettings();
  const wa = waHref(settings.whatsappNumber, d.wa.generalMsg, lang);
  const meta = LANG_META[lang];
  const suggest = Object.fromEntries(LOCALES.map((l) => [l, DICTS[l].suggest])) as Record<Lang, { text: string; go: string; dismiss: string }>;

  const org = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Sancak Tour",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [settings.social.instagram, settings.social.facebook, settings.social.youtube, settings.social.tiktok].filter(Boolean),
    areaServed: ["BA", "HR", "ME", "RS"],
    ...(settings.company.email ? { email: settings.company.email } : {}),
    ...(settings.company.phone ? { telephone: settings.company.phone } : {}),
  };

  return (
    <html lang={meta.hreflang} dir={meta.dir}>
      <body>
        <Header
          lang={lang}
          waHref={wa}
          nav={{ ...d.nav, siteName: d.meta.siteName }}
        />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer lang={lang} d={d} settings={settings} wa={wa} />
        <WaLink href={wa} label={d.nav.whatsapp} iconSize={30} className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-lift transition hover:scale-110 sm:h-16 sm:w-16">
          <span className="sr-only">{d.nav.whatsapp}</span>
        </WaLink>
        <LangSuggest lang={lang} strings={suggest} />
        <CookieConsent lang={lang} gaId={settings.analytics.gaId} t={d.cookie} />
        <JsonLd data={org} />
      </body>
    </html>
  );
}
