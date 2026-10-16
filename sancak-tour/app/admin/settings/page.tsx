import Link from "next/link";
import { requireUser, can } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";
import { GeneralForm, HomepageForm, PaymentsForm, SeoForm } from "@/components/admin/SettingsForms";

const TABS = [["general", "General, WhatsApp & social"], ["homepage", "Homepage sections"], ["seo", "SEO"], ["payments", "Payments"]] as const;

export default async function SettingsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const user = await requireUser("settings");
  const tab = TABS.some(([k]) => k === searchParams.tab) ? searchParams.tab! : "general";
  if (tab === "payments" && !can(user, "payments")) return <AdminTitle title="Payments" sub="Only owners can manage payment configuration." />;
  const s = readDb().settings;
  const key = process.env.STRIPE_SECRET_KEY || "";
  const stripe = key ? (key.startsWith("sk_test_") ? "Test key detected (no real charges)" : key.startsWith("sk_live_") ? "LIVE key detected — only use with a verified merchant account" : "Key present but not recognised") : "Not configured — set STRIPE_SECRET_KEY on the server";
  return (
    <>
      <AdminTitle title="Settings" />
      <nav aria-label="Settings sections" className="mb-8 flex flex-wrap gap-2">{TABS.filter(([k]) => k !== "payments" || can(user, "payments")).map(([k, l]) => <Link key={k} href={`/admin/settings?tab=${k}`} className={`chip !px-4 !py-2.5 text-sm ${tab === k ? "!bg-forest !text-ivory" : ""}`}>{l}</Link>)}</nav>
      <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        {tab === "general" && <GeneralForm initial={JSON.parse(JSON.stringify(s))} />}
        {tab === "homepage" && <HomepageForm initial={s.homepage} />}
        {tab === "seo" && <SeoForm initial={JSON.parse(JSON.stringify(s.seo))} />}
        {tab === "payments" && <PaymentsForm initial={s.payments} status={{ stripe, paypal: "Not connected — adapter pending merchant credentials" }} />}
      </div>
    </>
  );
}
