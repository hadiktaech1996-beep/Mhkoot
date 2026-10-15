import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { fmtEUR } from "@/lib/pricing";
import { AdminTitle } from "@/components/admin/Shell";

export default async function CustomersPage() {
  await requireUser("bookings");
  const db = readDb();
  const map = new Map<string, { name: string; email: string; phone: string; country: string; bookings: number; value: number; requests: number; last: string }>();
  const touch = (email: string, name: string, phone: string, country: string, at: string) => {
    const k = email.toLowerCase();
    const c = map.get(k) || { name, email, phone, country, bookings: 0, value: 0, requests: 0, last: at };
    if (at > c.last) c.last = at;
    map.set(k, c);
    return c;
  };
  db.bookings.filter((b) => b.status !== "cancelled").forEach((b) => { const c = touch(b.customer.email, b.customer.name, b.customer.phone, b.customer.country, b.createdAt); c.bookings++; if (["confirmed", "paid", "completed"].includes(b.status)) c.value += b.total; });
  db.requests.forEach((r) => { touch(r.email, r.name, r.phone, "", r.createdAt).requests++; });
  const list = [...map.values()].sort((a, b) => b.last.localeCompare(a.last));
  return (
    <>
      <AdminTitle title="Customers" sub="Built automatically from bookings and requests. Personal data: handle according to your privacy policy." />
      <div className="overflow-x-auto rounded-3xl bg-white shadow-card"><table className="w-full min-w-[640px] text-sm"><thead className="text-xs uppercase tracking-wider text-charcoal-400"><tr><th className="p-4 text-start">Customer</th><th className="p-4 text-start">Contact</th><th className="p-4 text-start">Bookings</th><th className="p-4 text-start">Requests</th><th className="p-4 text-start">Value</th></tr></thead>
        <tbody>{list.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-charcoal-500">No customers yet.</td></tr>}{list.map((c) => <tr key={c.email} className="border-t border-forest/10"><td className="p-4 font-semibold text-forest">{c.name}<br /><span className="font-normal text-charcoal-400">{c.country}</span></td><td className="p-4"><a className="underline" href={`mailto:${c.email}`}>{c.email}</a><br /><span dir="ltr">{c.phone}</span></td><td className="p-4">{c.bookings}</td><td className="p-4">{c.requests}</td><td className="p-4">{fmtEUR(c.value)}</td></tr>)}</tbody></table></div>
    </>
  );
}
