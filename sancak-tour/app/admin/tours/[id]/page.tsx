import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";
import { EntityForm } from "@/components/admin/EntityForm";

export default async function EditTour({ params }: { params: { id: string } }) {
  await requireUser("tours");
  const t = readDb().tours.find((x) => x.id === params.id);
  if (!t) notFound();
  return (<><AdminTitle title={t.title.en || t.slug} sub={`ID: ${t.id} · public page: /en/tours/${t.slug}`} /><EntityForm collection="tours" id={t.id} initial={JSON.parse(JSON.stringify(t))} /></>);
}
