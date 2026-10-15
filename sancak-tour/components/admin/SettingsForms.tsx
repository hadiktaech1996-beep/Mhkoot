"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FieldInput } from "./EntityForm";
import type { Settings } from "@/lib/types";

type Msg = { ok: boolean; text: string; issues?: string[] } | null;

function useSave(section: string) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  async function save(data: unknown) {
    setBusy(true); setMsg(null);
    const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section, data }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? { ok: true, text: "Saved." } : { ok: false, text: j.error || "Could not save", issues: j.issues });
    if (r.ok) router.refresh();
  }
  return { busy, msg, save };
}

function Shell({ onSave, busy, msg, children }: { onSave: () => void; busy: boolean; msg: Msg; children: React.ReactNode }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-5">
      {msg && <div role="status" className={`rounded-2xl p-4 text-sm ${msg.ok ? "bg-olive/20 text-forest" : "bg-red-50 text-red-800"}`}>{msg.text}{msg.issues && <ul className="mt-2 list-disc ps-5">{msg.issues.slice(0, 6).map((i) => <li key={i}>{i}</li>)}</ul>}</div>}
      {children}
      <button type="submit" disabled={busy} className="btn-gold min-w-[160px]">{busy && <Loader2 size={16} className="animate-spin" />}Save</button>
    </form>
  );
}
const T = (label: string, type: "text" | "checkbox" | "textarea" | "image" = "text", help?: string) => ({ key: "", label, type, help }) as const;

export function GeneralForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState(initial);
  const { busy, msg, save } = useSave("general");
  const set = (path: string[], v: any) => setS((o) => { const n: any = structuredClone(o); let c = n; path.slice(0, -1).forEach((k) => (c = c[k])); c[path[path.length - 1]] = v; return n; });
  const F = (path: string[], label: string, type: any = "text", help?: string) => <FieldInput f={{ ...T(label, type, help), key: path.join(".") }} value={path.reduce((a: any, k) => a?.[k], s)} onChange={(v) => set(path, v)} />;
  return (
    <Shell onSave={() => save({ company: s.company, whatsappNumber: s.whatsappNumber, social: s.social, analytics: s.analytics, heroImage: s.heroImage, heroVideo: s.heroVideo, showDemoReviews: s.showDemoReviews })} busy={busy} msg={msg}>
      <div className="grid gap-5 sm:grid-cols-2">
        {F(["whatsappNumber"], "WhatsApp number (digits only, with country code)", "text", "Example: 38761123456. Used by every WhatsApp button. Leave empty and buttons point to the contact page.")}
        {F(["company", "name"], "Company name")}
        {F(["company", "email"], "Public email")}
        {F(["company", "phone"], "Public phone")}
        <div className="sm:col-span-2">{F(["company", "address"], "Office address")}</div>
        <div className="sm:col-span-2">{F(["company", "legalInfoPending"], "Legal company details are NOT yet verified (shows draft notices on legal pages)", "checkbox")}</div>
        {F(["social", "instagram"], "Instagram URL")}{F(["social", "facebook"], "Facebook URL")}{F(["social", "tiktok"], "TikTok URL")}{F(["social", "youtube"], "YouTube URL")}
        {F(["analytics", "gaId"], "Google Analytics 4 ID", "text", "Loads only after visitors accept analytics cookies.")}
        {F(["analytics", "searchConsole"], "Google Search Console verification code")}
        <div className="sm:col-span-2">{F(["heroImage"], "Homepage hero photo", "image", "Wide landscape photo you are licensed to use.")}</div>
        {F(["heroVideo"], "Homepage hero video URL (optional MP4/WebM)")}
        <div className="sm:col-span-2">{F(["showDemoReviews"], "Show labelled DEMO reviews on the homepage (turn off once you have real reviews)", "checkbox")}</div>
      </div>
    </Shell>
  );
}

const SECTION_LABELS: Record<string, string> = { why: "Why choose us", destinations: "Popular destinations", featured: "Featured tours", vip: "Private & VIP", transfers: "Airport transfers", stay: "Hotels & accommodation", packages: "Multi-day packages", inspiration: "Travel inspiration (blog)", reviews: "Guest reviews", instagram: "Instagram gallery", faq: "FAQ", contact: "Contact & booking" };

export function HomepageForm({ initial }: { initial: Record<string, boolean> }) {
  const [h, setH] = useState(initial);
  const { busy, msg, save } = useSave("homepage");
  return (
    <Shell onSave={() => save({ homepage: h })} busy={busy} msg={msg}>
      <div className="grid gap-2 sm:grid-cols-2">{Object.entries(SECTION_LABELS).map(([k, label]) => (
        <label key={k} className="flex min-h-[52px] items-center gap-3 rounded-2xl bg-white px-4 shadow-card"><input type="checkbox" className="h-5 w-5 accent-forest" checked={h[k] !== false} onChange={(e) => setH({ ...h, [k]: e.target.checked })} />{label}</label>))}</div>
    </Shell>
  );
}

const PAGES = ["home", "tours", "transfers", "accommodation", "vip", "about", "contact"];
export function SeoForm({ initial }: { initial: Settings["seo"] }) {
  const [s, setS] = useState(initial);
  const { busy, msg, save } = useSave("seo");
  const blank = { en: "", tr: "", ar: "", de: "" };
  return (
    <Shell onSave={() => save({ seo: Object.fromEntries(Object.entries(s).filter(([, v]) => Object.values(v.title).some(Boolean) || Object.values(v.description).some(Boolean))) })} busy={busy} msg={msg}>
      <p className="text-sm text-charcoal-500">Leave a field empty to use the built-in translated default. Titles: ~55 characters. Descriptions: ~150 characters.</p>
      {PAGES.map((p) => (
        <details key={p} className="rounded-2xl bg-white p-5 shadow-card"><summary className="cursor-pointer font-display text-xl font-semibold capitalize text-forest">{p}</summary>
          <div className="mt-4 space-y-4">
            <FieldInput f={{ key: "t", label: "Meta title", type: "l" }} value={s[p]?.title || blank} onChange={(v) => setS({ ...s, [p]: { title: v, description: s[p]?.description || blank } })} />
            <FieldInput f={{ key: "d", label: "Meta description", type: "ltextarea" }} value={s[p]?.description || blank} onChange={(v) => setS({ ...s, [p]: { title: s[p]?.title || blank, description: v } })} />
          </div></details>))}
    </Shell>
  );
}

export function PaymentsForm({ initial, status }: { initial: Settings["payments"]; status: { stripe: string; paypal: string } }) {
  const [p, setP] = useState(initial);
  const { busy, msg, save } = useSave("payments");
  return (
    <Shell onSave={() => save({ payments: p })} busy={busy} msg={msg}>
      <div className="rounded-2xl bg-gold/20 p-4 text-sm text-forest"><b>Payment providers stay in TEST mode until your merchant accounts are verified.</b> Card details are handled only by Stripe&apos;s hosted checkout — this website never sees or stores card numbers.</div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2"><div className="rounded-2xl bg-white p-4 shadow-card"><dt className="font-semibold text-forest">Stripe</dt><dd className="text-charcoal-500">{status.stripe}</dd></div><div className="rounded-2xl bg-white p-4 shadow-card"><dt className="font-semibold text-forest">PayPal</dt><dd className="text-charcoal-500">{status.paypal}</dd></div></dl>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="label">Mode</span><select className="field" value={p.mode} onChange={(e) => setP({ ...p, mode: e.target.value as "test" | "live" })}><option value="test">Test (no real charges)</option><option value="live">Live (only with verified merchant account)</option></select></label>
        <div />
        {([["card", "Offer card payment (needs Stripe key)"], ["paypal", "Offer PayPal (adapter not connected yet)"], ["bank", "Offer bank transfer"], ["arrival", "Offer pay on arrival"]] as const).map(([k, l]) => (
          <label key={k} className="flex min-h-[52px] items-center gap-3 rounded-2xl bg-white px-4 shadow-card"><input type="checkbox" className="h-5 w-5 accent-forest" checked={p[k]} onChange={(e) => setP({ ...p, [k]: e.target.checked })} />{l}</label>))}
      </div>
      <label className="block"><span className="label">Bank transfer details (included in the confirmation email)</span><textarea rows={4} className="field" value={p.bankDetails} onChange={(e) => setP({ ...p, bankDetails: e.target.value })} /></label>
    </Shell>
  );
}
