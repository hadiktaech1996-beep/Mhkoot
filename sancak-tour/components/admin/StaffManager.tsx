"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "@/lib/types";

interface U { id: string; email: string; name: string; role: Role; active: boolean }
const ROLES: Role[] = ["owner", "manager", "editor", "support"];
const ROLE_HELP: Record<Role, string> = { owner: "Everything, including staff and payments", manager: "Bookings, requests, tours, content, translations, settings", editor: "Tours, content and translations only", support: "Bookings and customer requests only" };

export function StaffManager({ users, meId }: { users: U[]; meId: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function call(url: string, method: string, body: unknown) {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    setMsg(r.ok ? "Saved." : j.error || "Error");
    if (r.ok) router.refresh();
    return r.ok;
  }
  return (
    <div className="space-y-8">
      {msg && <p role="status" className="rounded-xl bg-white p-3 text-sm shadow-card">{msg}</p>}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-card"><table className="w-full text-sm"><thead className="text-start text-xs uppercase tracking-wider text-charcoal-400"><tr><th className="p-4 text-start">Name</th><th className="p-4 text-start">Role</th><th className="p-4 text-start">Active</th><th className="p-4 text-start">New password</th></tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u.id} className="border-t border-forest/10"><td className="p-4"><b className="text-forest">{u.name}</b><br /><span className="text-charcoal-400">{u.email}</span></td>
            <td className="p-4"><select aria-label="Role" className="field !min-h-[40px] !py-1 !text-sm" value={u.role} onChange={(e) => call(`/api/admin/users/${u.id}`, "PATCH", { role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select><p className="mt-1 text-xs text-charcoal-400">{ROLE_HELP[u.role]}</p></td>
            <td className="p-4"><label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-forest" checked={u.active} disabled={u.id === meId} onChange={(e) => call(`/api/admin/users/${u.id}`, "PATCH", { active: e.target.checked })} />{u.active ? "Active" : "Disabled"}</label></td>
            <td className="p-4"><form onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget; const pw = (f.elements.namedItem("pw") as HTMLInputElement).value; if (await call(`/api/admin/users/${u.id}`, "PATCH", { password: pw })) f.reset(); }} className="flex gap-2"><input name="pw" type="password" minLength={12} placeholder="min. 12 characters" autoComplete="new-password" className="field !min-h-[40px] !py-1 !text-sm" aria-label={`New password for ${u.email}`} /><button className="btn-ghost !min-h-[40px] !px-3">Set</button></form></td></tr>))}</tbody></table></div>
      <form onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget; const d = Object.fromEntries(new FormData(f)); if (await call("/api/admin/users", "POST", d)) f.reset(); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-card sm:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold text-forest sm:col-span-2">Add staff member</h2>
        <label><span className="label">Name</span><input name="name" required className="field" /></label>
        <label><span className="label">Email</span><input name="email" type="email" required className="field" /></label>
        <label><span className="label">Role</span><select name="role" className="field" defaultValue="support">{ROLES.map((r) => <option key={r}>{r}</option>)}</select></label>
        <label><span className="label">Temporary password (min. 12 characters)</span><input name="password" type="password" required minLength={12} autoComplete="new-password" className="field" /></label>
        <div className="sm:col-span-2"><button className="btn-primary">Create account</button></div>
      </form>
    </div>
  );
}
