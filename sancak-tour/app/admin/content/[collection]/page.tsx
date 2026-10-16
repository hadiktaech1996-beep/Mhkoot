import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDb, type Collection } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";
import { COLLECTIONS, type CollectionName } from "@/lib/admin/fields";

export default async function ContentList({ params }: { params: { collection: string } }) {
  const def = COLLECTIONS[params.collection as CollectionName];
  if (!def || def.name === "tours") notFound();
  await requireUser(def.permission);
  const list = readDb()[def.name as Collection] as unknown as Record<string, any>[];
  const title = (x: Record<string, any>) => (x[def.titleKey]?.en ?? x[def.titleKey] ?? x.slug ?? x.id) as string;
  return (
    <>
      <AdminTitle title={def.label} action={<Link href={`/admin/content/${def.name}/new`} className="btn-gold"><Plus size={16} />Add {def.singular}</Link>} />
      <ul className="space-y-3">{list.length === 0 && <li className="rounded-2xl bg-white p-8 text-center text-charcoal-500 shadow-card">Nothing here yet.</li>}
        {list.map((x) => (
          <li key={x.id}><Link href={`/admin/content/${def.name}/${x.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-card transition hover:shadow-lift">
            <b className="font-display text-xl text-forest">{title(x)}</b>
            <span className="flex flex-wrap items-center gap-3 text-sm text-charcoal-500">{def.listCols.map((c) => <span key={c.key}>{c.label}: <b>{String(x[c.key])}</b></span>)}
              {(x.published === false || x.active === false) ? <span className="chip">Hidden</span> : <span className="chip !bg-olive/30">Live</span>}{x.sample && <span className="demo-badge">demo</span>}</span></Link></li>))}</ul>
    </>
  );
}
