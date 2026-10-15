"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/i18n/config";

interface Labels { title: string; text: string; accept: string; reject: string; customize: string; save: string; necessary: string; necessaryText: string; analytics: string; analyticsText: string; marketing: string; marketingText: string; policy: string }
type Consent = { analytics: boolean; marketing: boolean; ts: number };
const KEY = "sancak-consent-v1";

function loadGA(id: string) {
  if (!id || document.getElementById("ga-script")) return;
  const s = document.createElement("script");
  s.id = "ga-script"; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  (window as any).dataLayer = (window as any).dataLayer || [];
  const gtag = function (...a: unknown[]) { (window as any).dataLayer.push(a); };
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });
}

export function CookieSettingsButton({ label }: { label: string }) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))} className="text-sm text-ivory/75 underline-offset-4 transition hover:text-gold hover:underline">{label}</button>;
}

/** GDPR-conscious: nothing optional is loaded before an explicit choice. Analytics (GA4) loads only after opt-in and only if an ID is configured. */
export function CookieConsent({ lang, gaId, t }: { lang: Lang; gaId: string; t: Labels }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let c: Consent | null = null;
    try { c = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    if (c) { setAnalytics(c.analytics); setMarketing(c.marketing); if (c.analytics) loadGA(gaId); } else setOpen(true);
    const reopen = () => { setOpen(true); setCustom(true); };
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, [gaId]);

  const save = (a: boolean, m: boolean) => {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics: a, marketing: m, ts: Date.now() })); } catch {}
    setAnalytics(a); setMarketing(m); setOpen(false); setCustom(false);
    if (a) loadGA(gaId);
    else if (typeof window !== "undefined") (window as any)[`ga-disable-${gaId}`] = true;
  };

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="ck-title" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-lift ring-1 ring-black/5 sm:inset-x-6 sm:bottom-6 sm:p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 shrink-0 text-olive-700" size={22} aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="ck-title" className="font-display text-xl font-semibold text-forest">{t.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{t.text} <Link href={`/${lang}/legal/cookies`} className="font-medium text-forest underline underline-offset-4">{t.policy}</Link></p>
          {custom && (
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-start gap-3 opacity-80"><input type="checkbox" checked disabled className="mt-1 h-5 w-5 accent-forest" /><span><b className="text-forest">{t.necessary}</b><br />{t.necessaryText}</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-5 w-5 accent-forest" /><span><b className="text-forest">{t.analytics}</b><br />{t.analyticsText}</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-5 w-5 accent-forest" /><span><b className="text-forest">{t.marketing}</b><br />{t.marketingText}</span></label>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2.5">
            {/* Accept and reject carry equal visual weight (no dark patterns) */}
            <button type="button" className="btn-primary !min-h-[44px]" onClick={() => save(true, true)}>{t.accept}</button>
            <button type="button" className="btn-primary !min-h-[44px]" onClick={() => save(false, false)}>{t.reject}</button>
            {custom ? (
              <button type="button" className="btn-ghost !min-h-[44px]" onClick={() => save(analytics, marketing)}>{t.save}</button>
            ) : (
              <button type="button" className="btn-ghost !min-h-[44px]" onClick={() => setCustom(true)}>{t.customize}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
