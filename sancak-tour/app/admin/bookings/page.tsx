import Link from "next/link";
import { Download } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { fmtEUR } from "@/lib/pricing";
import { AdminTitle } from "@/components/admin/Shell";
import { NotesField, StatusSelect } from "@/components/admin/small";
import { BOOKING_STATUSES } from "@/lib/types";

const label = (s: string) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) });

export default async function BookingsPage({ searchParams }: { searchParams: { status?: string } }) {
  await requireUser("bookings");
  const all = readDb().bookings;
  const list = searchParams.status ? all.filter((b) => b.status === searchParams.status) : all;
  return (
    <>
      <AdminTitle title="Bookings" sub="Change a booking's status with the dropdown. Customers are not emailed automatically on status change; contact them by email or WhatsApp." action={<a href="/api/admin/export?type=bookings" className="btn-primary"><Download size={16} />Export CSV</a>} />
      <nav aria-label="Filter" className="mb-5 flex flex-wrap gap-2">
        <Link href="/admin/bookings" className={`chip !px-4 !py-2 ${!searchParams.status ? "!bg-forest !text-ivory" : ""}`}>All ({all.length})</Link>
        {BOOKING_STATUSES.map((s) => <Link key={s} href={`/admin/bookings?status=${s}`} className={`chip !px-4 !py-2 capitalize ${searchParams.status === s ? "!bg-forest !text-ivory" : ""}`}>{s} ({all.filter((b) => b.status === s).length})</Link>)}
      </nav>
      {list.length === 0 ? <p className="rounded-3xl bg-white p-10 text-center text-charcoal-500 shadow-card">No bookings yet.</p> : (
        <ul className="space-y-4">
          {list.map((b) => (
            <li key={b.id} className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="font-mono text-sm font-bold text-forest">{b.ref} {b.sample && <span className="demo-badge ms-2">demo</span>}</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest">{b.tourTitle}</h2>
                  <p className="text-sm text-charcoal-500">{b.date} · {b.adults} adults, {b.children} children · {b.mode} · lang {b.lang.toUpperCase()}</p></div>
                <div className="text-end"><p className="font-display text-3xl font-bold text-forest">{fmtEUR(b.total)}</p><p className="text-xs text-charcoal-400">{new Date(b.createdAt).toLocaleString("en-GB")}</p></div>
              </div>
              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Customer</p><p>{b.customer.name}</p><a className="underline" href={`mailto:${b.customer.email}`}>{b.customer.email}</a><br /><a className="underline" href={`tel:${b.customer.phone}`} dir="ltr">{b.customer.phone}</a>{b.customer.country && <p className="text-charcoal-400">{b.customer.country}</p>}</div>
                <div><p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Details</p>{b.extras.length > 0 && <p>Extras: {b.extras.map((e) => e.label).join(", ")}</p>}{b.promoCode && <p>Promo {b.promoCode} (−{fmtEUR(b.discount)})</p>}{b.customer.notes && <p className="mt-1 rounded-lg bg-ivory p-2 text-charcoal-500">“{b.customer.notes}”</p>}</div>
                <div className="space-y-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Status</p><StatusSelect endpoint={`/api/admin/bookings/${b.id}`} field="status" value={b.status} options={BOOKING_STATUSES.map(label)} /></div>
                  <div><p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Payment · {b.paymentMethod}</p><StatusSelect endpoint={`/api/admin/bookings/${b.id}`} field="paymentStatus" value={b.paymentStatus} options={["unpaid", "awaiting", "paid", "refunded"].map(label)} /></div></div>
              </div>
              <div className="mt-4"><NotesField endpoint={`/api/admin/bookings/${b.id}`} value={b.internalNotes || ""} /></div>
            </li>))}
        </ul>)}
    </>
  );
}
