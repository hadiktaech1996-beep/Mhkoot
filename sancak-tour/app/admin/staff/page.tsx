import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { AdminTitle } from "@/components/admin/Shell";
import { StaffManager } from "@/components/admin/StaffManager";

export default async function StaffPage() {
  const me = await requireUser("staff");
  const users = readDb().users.map(({ id, email, name, role, active }) => ({ id, email, name, role, active }));
  return (<><AdminTitle title="Staff & permissions" sub="Owners can do everything. Give each team member the lowest role that lets them do their job." /><StaffManager users={users} meId={me.id} /></>);
}
