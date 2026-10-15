import { requireUser } from "@/lib/auth";
import { AdminTitle } from "@/components/admin/Shell";
import { EntityForm } from "@/components/admin/EntityForm";
import { COLLECTIONS } from "@/lib/admin/fields";

export default async function NewTour() {
  await requireUser("tours");
  return (<><AdminTitle title="New tour" sub="Fill in all four languages so visitors never see missing text." /><EntityForm collection="tours" initial={COLLECTIONS.tours.blank()} /></>);
}
