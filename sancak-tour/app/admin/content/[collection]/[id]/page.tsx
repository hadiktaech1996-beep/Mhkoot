import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readDb, type Collection } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";
import { EntityForm } from "@/components/admin/EntityForm";
import { COLLECTIONS, type CollectionName } from "@/lib/admin/fields";

export default async function EditContent({ params }: { params: { collection: string; id: string } }) {
  const def = COLLECTIONS[params.collection as CollectionName];
  if (!def || def.name === "tours") notFound();
  await requireUser(def.permission);
  const item = (readDb()[def.name as Collection] as unknown as Record<string, any>[]).find((x) => x.id === params.id);
  if (!item) notFound();
  return (<><AdminTitle title={`Edit ${def.singular}`} sub={`ID: ${item.id}`} /><EntityForm collection={def.name} id={item.id} initial={JSON.parse(JSON.stringify(item))} /></>);
}
