"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { router.push("/admin"); router.refresh(); } else { setErr(j.error || "Login failed"); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div><label htmlFor="email" className="label">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="field" /></div>
      <div><label htmlFor="password" className="label">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
      {err && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{err}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">{busy && <Loader2 size={16} className="animate-spin" />}Sign in</button>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return <button type="button" className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm text-ivory/75 transition hover:bg-white/10 hover:text-white" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }}><LogOut size={18} />Sign out</button>;
}

/** Select that PATCHes a field of a record (booking / request status). */
export function StatusSelect({ endpoint, field, value, options }: { endpoint: string; field: string; value: string; options: { value: string; label: string }[] }) {
  const [v, setV] = useState(value);
  const [state, setState] = useState<"" | "saving" | "saved" | "error">("");
  async function change(next: string) {
    const prev = v; setV(next); setState("saving");
    const r = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: next }) });
    if (r.ok) { setState("saved"); setTimeout(() => setState(""), 1500); } else { setV(prev); setState("error"); }
  }
  const color: Record<string, string> = { pending: "bg-gold/30", new: "bg-gold/30", confirmed: "bg-sky-100", paid: "bg-olive/30", completed: "bg-forest/10", cancelled: "bg-red-100", closed: "bg-forest/10", done: "bg-olive/30" };
  return (
    <span className="inline-flex items-center gap-2">
      <select aria-label={field} value={v} onChange={(e) => change(e.target.value)} className={`min-h-[40px] rounded-full border-0 px-3 text-sm font-semibold ${color[v] || "bg-ivory-200"}`}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      <span className="w-4 text-xs" aria-live="polite">{state === "saving" ? "…" : state === "saved" ? "✓" : state === "error" ? "!" : ""}</span>
    </span>
  );
}

export function NotesField({ endpoint, value }: { endpoint: string; value: string }) {
  const [v, setV] = useState(value || "");
  const [saved, setSaved] = useState(true);
  return (
    <textarea aria-label="Internal notes" rows={2} maxLength={4000} placeholder="Internal notes…" className="field !min-h-[40px] !py-2 !text-xs" value={v}
      onChange={(e) => { setV(e.target.value); setSaved(false); }}
      onBlur={async () => { if (!saved) { await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internalNotes: v }) }); setSaved(true); } }} />
  );
}
