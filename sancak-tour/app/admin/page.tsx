import Link from "next/link";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { fmtEUR } from "@/lib/pricing";
import { AdminTitle } from "@/components/admin/Shell";
import { BOOKING_STATUSES } from "@/lib/types";

export default async function Dashboard({ searchParams }: { searchParams: { denied?: string } }) {
  await requireUser("bookings");
  const db = readDb();
  const s = db.settings;
  const bookings = db.bookings;
  const real = bookings.filter((b) => !b.sample);
  const byStatus = Object.fromEntries(BOOKING_STATUSES.map((st) => [st, bookings.filter((b) => b.status === st).length]));
  const value = bookings.filter((b) => ["confirmed", "paid", "completed"].includes(b.status)).reduce((a, b) => a + b.total, 0);
  const newReq = db.requests.filter((r) => r.status === "new").length;

  // bookings per week, last 8 weeks
  const now = Date.now();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const from = now - (7 - i) * 7 * 864e5, to = from + 7 * 864e5;
    return { label: new Date(from).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), n: bookings.filter((b) => { const t = Date.parse(b.createdAt); return t >= from && t < to; }).length };
  });
  const max = Math.max(1, ...weeks.map((w) => w.n));

  const checks: [boolean, string, string][] = [
    [!!s.whatsappNumber, "WhatsApp number set", "/admin/settings"],
    [!!process.env.SMTP_HOST, "Email (SMTP) configured — confirmation emails are sent", "/admin/settings"],
    [!!(s.company.email), "Public company email set", "/admin/settings"],
    [!!process.env.SESSION_SECRET, "SESSION_SECRET configured on the server", "/admin/settings"],
    [!s.company.legalInfoPending, "Legal company details verified and entered", "/admin/settings"],
    [db.tours.every((t) => !t.sample), "Demonstration tours replaced with real tours & prices", "/admin/tours"],
    [!!s.heroImage || !!s.heroVideo, "Licensed hero photo / video uploaded", "/admin/settings"],
    [s.payments.mode === "live" ? !!process.env.STRIPE_SECRET_KEY : true, "Payments: test mode (or verified live setup)", "/admin/settings?tab=payments"],
  ];

  return (
    <>
      <AdminTitle title="Dashboard" sub="Overview of bookings and requests. Booking totals below include demonstration bookings." />
      {searchParams.denied && <p role="alert" className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-800"><AlertTriangle size={18} />Your role does not have access to that area.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Bookings (all)", String(bookings.length)], ["Pending", String(byStatus.pending)], ["New requests", String(newReq)], ["Confirmed + paid + completed", fmtEUR(value)]].map(([k, v]) => (
          <div key={k} className="rounded-3xl bg-white p-6 shadow-card"><p className="text-xs font-semibold uppercase tracking-wider text-gold-700">{k}</p><p className="mt-2 font-display text-4xl font-bold text-forest">{v}</p></div>))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-card" aria-labelledby="w">
          <h2 id="w" className="font-display text-2xl font-semibold text-forest">Bookings per week</h2>
          <svg viewBox="0 0 320 140" className="mt-4 w-full" role="img" aria-label={`Bookings per week: ${weeks.map((w) => `${w.label} ${w.n}`).join(", ")}`}>
            {weeks.map((w, i) => { const h = (w.n / max) * 90; return <g key={i}><rect x={i * 40 + 6} y={110 - h} width="28" height={h || 2} rx="6" fill={w.n ? "#213D32" : "#E3DDC8"} /><text x={i * 40 + 20} y={104 - h} textAnchor="middle" fontSize="10" fill="#17212B">{w.n || ""}</text><text x={i * 40 + 20} y="128" textAnchor="middle" fontSize="8" fill="#66727E">{w.label}</text></g>; })}
          </svg>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-card"><h2 className="font-display text-2xl font-semibold text-forest">By status</h2>
          <ul className="mt-4 space-y-3">{BOOKING_STATUSES.map((st) => <li key={st} className="flex items-center gap-3 text-sm"><span className="w-24 capitalize">{st}</span><span className="h-3 flex-1 overflow-hidden rounded-full bg-ivory-200"><span className="block h-full rounded-full bg-gold" style={{ width: `${bookings.length ? (byStatus[st] / bookings.length) * 100 : 0}%` }} /></span><b className="w-6 text-end">{byStatus[st]}</b></li>)}</ul>
          <p className="mt-4 text-xs text-charcoal-400">{real.length} real / {bookings.length - real.length} demonstration bookings</p></section>
      </div>
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-card"><h2 className="font-display text-2xl font-semibold text-forest">Go-live checklist</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{checks.map(([ok, label, href]) => <li key={label}><Link href={href} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm hover:bg-ivory">{ok ? <CheckCircle2 size={20} className="shrink-0 text-olive-700" /> : <Circle size={20} className="shrink-0 text-gold-600" />}<span className={ok ? "text-charcoal-500" : "font-medium text-forest"}>{label}</span></Link></li>)}</ul></section>
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold text-forest">Latest bookings</h2><Link href="/admin/bookings" className="text-sm font-semibold text-forest underline">All bookings</Link></div>
        {bookings.length ? <ul className="mt-4 divide-y divide-forest/10">{bookings.slice(0, 6).map((b) => <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span><b className="font-mono">{b.ref}</b> · {b.tourTitle} · {b.date}</span><span>{b.customer.name} · {fmtEUR(b.total)} · <span className="chip capitalize">{b.status}</span></span></li>)}</ul> : <p className="mt-4 text-sm text-charcoal-500">No bookings yet.</p>}</section>
    </>
  );
}
