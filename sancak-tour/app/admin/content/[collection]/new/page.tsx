import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { AdminTitle } from "@/components/admin/Shell";
import { EntityForm } from "@/components/admin/EntityForm";
import { COLLECTIONS, type CollectionName } from "@/lib/admin/fields";

export default async function NewContent({ params }: { params: { collection: string } }) {
  const def = COLLECTIONS[params.collection as CollectionName];
  if (!def || def.name === "tours") notFound();
  await requireUser(def.permission);
  return (<><AdminTitle title={`New ${def.singular}`} /><EntityForm collection={def.name} initial={def.blank()} /></>);
}
