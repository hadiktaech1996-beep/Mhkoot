import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";

export default async function ToursAdmin() {
  await requireUser("tours");
  const tours = readDb().tours;
  return (
    <>
      <AdminTitle title="Tours & prices" sub="Edit prices, availability, descriptions in all four languages, photos and itineraries." action={<Link href="/admin/tours/new" className="btn-gold"><Plus size={16} />New tour</Link>} />
      <ul className="space-y-3">{tours.map((t) => (
        <li key={t.id}><Link href={`/admin/tours/${t.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-card transition hover:shadow-lift">
          <span><b className="font-display text-xl text-forest">{t.title.en || t.slug}</b><br /><span className="text-xs text-charcoal-400">/{t.slug} · {t.destination} · {t.days > 1 ? `${t.days} days` : `${t.hours} h`}</span></span>
          <span className="flex flex-wrap items-center gap-2 text-sm"><span>€{t.priceGroup || "—"} / person</span><span>€{t.pricePrivate || "—"} private</span>
            {t.published ? <span className="chip !bg-olive/30">Published</span> : <span className="chip">Draft</span>}{t.featured && <span className="chip !bg-gold/40">Featured</span>}{t.sample && <span className="demo-badge">demo</span>}</span></Link></li>))}</ul>
    </>
  );
}
