"use client";
import { useMemo, useState } from "react";

interface Row { path: string; en: string; values: Record<string, string>; edited: Record<string, boolean> }
const LANGS = [["en", "English"], ["tr", "Türkçe"], ["ar", "العربية"], ["de", "Deutsch"]] as const;

export function TranslationsEditor({ rows: initial }: { rows: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [lang, setLang] = useState<string>("tr");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => !s || r.path.toLowerCase().includes(s) || r.en.toLowerCase().includes(s) || (r.values[lang] || "").toLowerCase().includes(s));
  }, [rows, q, lang]);
  const pageRows = filtered.slice(page * 25, page * 25 + 25);

  async function save(path: string, value: string | null) {
    setStatus((s) => ({ ...s, [path]: "saving" }));
    const r = await fetch("/api/admin/translations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang, path, value }) });
    setStatus((s) => ({ ...s, [path]: r.ok ? "saved" : "error" }));
    if (r.ok) setRows((all) => all.map((x) => (x.path === path ? { ...x, edited: { ...x.edited, [lang]: value !== null } } : x)));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div role="tablist" aria-label="Language" className="flex gap-1 rounded-full bg-white p-1 shadow-card">{LANGS.map(([k, n]) => <button key={k} role="tab" aria-selected={lang === k} onClick={() => { setLang(k); setPage(0); }} className={`min-h-[40px] rounded-full px-4 text-sm font-semibold ${lang === k ? "bg-forest text-ivory" : "text-forest"}`}>{n}</button>)}</div>
        <label className="min-w-[240px] flex-1"><span className="label">Search text or key</span><input className="field !min-h-[44px]" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} /></label>
      </div>
      <p className="mt-3 text-sm text-charcoal-500">{filtered.length} texts · edits apply immediately and override the built-in translation. Clear a text to restore the original.</p>
      <ul className="mt-5 space-y-3">
        {pageRows.map((r) => (
          <li key={r.path} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center justify-between gap-2"><code className="text-xs text-charcoal-400">{r.path}</code><span className="text-xs">{r.edited[lang] && <span className="chip !bg-gold/40">edited</span>} {status[r.path] === "saving" ? "…" : status[r.path] === "saved" ? "✓ saved" : status[r.path] === "error" ? "⚠ error" : ""}</span></div>
            {lang !== "en" && <p className="mt-1 text-xs text-charcoal-400">EN: {r.en}</p>}
            <textarea key={lang + r.path + String(r.edited[lang])} dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} rows={Math.min(5, Math.max(1, Math.ceil((r.values[lang] || "").length / 70)))} defaultValue={r.values[lang]} className="field mt-2 !py-2 !text-sm" aria-label={`${r.path} (${lang})`}
              onBlur={(e) => { const v = e.target.value; if (v !== r.values[lang]) { setRows((all) => all.map((x) => (x.path === r.path ? { ...x, values: { ...x.values, [lang]: v } } : x))); save(r.path, v); } }} />
          </li>))}
      </ul>
      <div className="mt-6 flex items-center justify-between"><button className="btn-ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm">{page + 1} / {Math.max(1, Math.ceil(filtered.length / 25))}</span><button className="btn-ghost" disabled={(page + 1) * 25 >= filtered.length} onClick={() => setPage(page + 1)}>Next</button></div>
    </div>
  );
}
