import Link from "next/link";
import { Download } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";
import { NotesField, StatusSelect } from "@/components/admin/small";
import { REQUEST_STATUSES } from "@/lib/types";

const TYPES = ["transfer", "vip", "accommodation", "contact"] as const;
const lab = (s: string) => ({ value: s, label: s.replace("_", " ").replace(/^./, (c) => c.toUpperCase()) });

export default async function RequestsPage({ searchParams }: { searchParams: { type?: string } }) {
  await requireUser("requests");
  const all = readDb().requests;
  const list = searchParams.type ? all.filter((r) => r.type === searchParams.type) : all;
  return (
    <>
      <AdminTitle title="Requests & transfers" sub="Transfer requests, VIP itinerary requests, accommodation inquiries and contact messages." action={<a href="/api/admin/export?type=requests" className="btn-primary"><Download size={16} />Export CSV</a>} />
      <nav aria-label="Filter" className="mb-5 flex flex-wrap gap-2">
        <Link href="/admin/requests" className={`chip !px-4 !py-2 ${!searchParams.type ? "!bg-forest !text-ivory" : ""}`}>All ({all.length})</Link>
        {TYPES.map((t) => <Link key={t} href={`/admin/requests?type=${t}`} className={`chip !px-4 !py-2 capitalize ${searchParams.type === t ? "!bg-forest !text-ivory" : ""}`}>{t} ({all.filter((r) => r.type === t).length})</Link>)}
      </nav>
      {list.length === 0 ? <p className="rounded-3xl bg-white p-10 text-center text-charcoal-500 shadow-card">No requests yet.</p> : (
        <ul className="space-y-4">{list.map((r) => (
          <li key={r.id} className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-sm font-bold text-forest">{r.ref} · <span className="capitalize">{r.type}</span> · {r.lang.toUpperCase()}</p><h2 className="font-display text-2xl font-semibold text-forest">{r.name}</h2>
              <p className="text-sm"><a className="underline" href={`mailto:${r.email}`}>{r.email}</a> · <a className="underline" href={`tel:${r.phone}`} dir="ltr">{r.phone}</a></p></div>
              <div className="text-end"><StatusSelect endpoint={`/api/admin/requests/${r.id}`} field="status" value={r.status} options={REQUEST_STATUSES.map(lab)} /><p className="mt-1 text-xs text-charcoal-400">{new Date(r.createdAt).toLocaleString("en-GB")}</p></div></div>
            <dl className="mt-4 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">{Object.entries(r.data).map(([k, v]) => <div key={k} className="flex gap-2"><dt className="shrink-0 text-charcoal-400">{k}:</dt><dd className="min-w-0 break-words">{String(v)}</dd></div>)}</dl>
            <div className="mt-4"><NotesField endpoint={`/api/admin/requests/${r.id}`} value={r.internalNotes || ""} /></div>
          </li>))}</ul>)}
    </>
  );
}
