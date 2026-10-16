"use client";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Loader2, Plus, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { COLLECTIONS, type CollectionName, type FieldDef } from "@/lib/admin/fields";

type Obj = Record<string, any>;
const LANGS = [["en", "EN"], ["tr", "TR"], ["ar", "AR"], ["de", "DE"]] as const;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const inp = "field !min-h-[44px] !py-2 !text-sm";

function defaultFor(f: FieldDef): any {
  switch (f.type) {
    case "l": case "ltextarea": return { en: "", tr: "", ar: "", de: "" };
    case "text": case "textarea": return "";
    case "number": return 0;
    default: return "";
  }
}

export function FieldInput({ f, value, onChange }: { f: FieldDef; value: any; onChange: (v: any) => void }) {
  const uid = useId();
  const id = `f-${f.key}-${uid.replace(/:/g, "")}`;
  switch (f.type) {
    case "checkbox":
      return <label className="flex min-h-[44px] items-center gap-3 text-sm font-medium text-forest"><input type="checkbox" className="h-5 w-5 accent-forest" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.label}</label>;
    case "text": return <div><label htmlFor={id} className="label">{f.label}</label><input id={id} className={inp} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />{f.help && <p className="mt-1 text-xs text-charcoal-400">{f.help}</p>}</div>;
    case "textarea": return <div><label htmlFor={id} className="label">{f.label}</label><textarea id={id} rows={4} className={inp} value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></div>;
    case "number": return <div><label htmlFor={id} className="label">{f.label}</label><input id={id} type="number" min={f.min} max={f.max} step={f.step ?? 1} className={inp} value={Number.isFinite(value) ? value : ""} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} /></div>;
    case "select": return <div><label htmlFor={id} className="label">{f.label}</label><select id={id} className={inp} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
    case "l":
    case "ltextarea":
      return (
        <fieldset className="rounded-2xl border border-forest/15 p-4"><legend className="px-2 text-sm font-semibold text-forest">{f.label}</legend>
          <div className="space-y-3">{LANGS.map(([k, label]) => (
            <div key={k} className="flex items-start gap-3"><span className="mt-2.5 w-8 shrink-0 text-xs font-bold text-gold-700">{label}</span>
              {f.type === "l" ? <input className={inp} dir={k === "ar" ? "rtl" : "ltr"} lang={k} aria-label={`${f.label} (${label})`} value={value?.[k] ?? ""} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
                : <textarea className={inp} rows={4} dir={k === "ar" ? "rtl" : "ltr"} lang={k} aria-label={`${f.label} (${label})`} value={value?.[k] ?? ""} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />}</div>))}</div>
        </fieldset>);
    case "llist":
      return (
        <fieldset className="rounded-2xl border border-forest/15 p-4"><legend className="px-2 text-sm font-semibold text-forest">{f.label}</legend>
          <div className="space-y-3">{LANGS.map(([k, label]) => (
            <div key={k} className="flex items-start gap-3"><span className="mt-2.5 w-8 shrink-0 text-xs font-bold text-gold-700">{label}</span>
              <textarea className={inp} rows={5} dir={k === "ar" ? "rtl" : "ltr"} lang={k} aria-label={`${f.label} (${label})`} value={(value?.[k] ?? []).join("\n")} onChange={(e) => onChange({ ...value, [k]: e.target.value.split("\n") })} /></div>))}</div>
        </fieldset>);
    case "tags":
    case "dates":
      return <div><label htmlFor={id} className="label">{f.label}</label><textarea id={id} rows={3} className={inp} value={(value ?? []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} />{f.help && <p className="mt-1 text-xs text-charcoal-400">{f.help}</p>}</div>;
    case "multi":
      return <fieldset><legend className="label">{f.label}</legend><div className="flex flex-wrap gap-2">{f.options?.map((o) => {
        const on = (value ?? []).includes(o.value);
        return <label key={o.value} className={`chip cursor-pointer !px-3.5 !py-2 text-sm ${on ? "!bg-forest !text-ivory" : ""}`}><input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? value.filter((x: string) => x !== o.value) : [...(value ?? []), o.value])} />{o.label}</label>; })}</div></fieldset>;
    case "weekdays":
      return <fieldset><legend className="label">{f.label}</legend><div className="flex flex-wrap gap-2">{WEEKDAYS.map((d, i) => {
        const on = (value ?? []).includes(i);
        return <label key={d} className={`chip cursor-pointer !px-3.5 !py-2 text-sm ${on ? "!bg-forest !text-ivory" : ""}`}><input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? value.filter((x: number) => x !== i) : [...(value ?? []), i].sort())} />{d}</label>; })}</div></fieldset>;
    case "image":
      return <ImageField f={f} value={value} onChange={onChange} id={id} />;
    case "repeater":
      return <Repeater f={f} value={value ?? []} onChange={onChange} />;
  }
}

function ImageField({ f, value, onChange, id }: { f: FieldDef; value: string; onChange: (v: string) => void; id: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function up(file: File) {
    setBusy(true); setErr("");
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) setErr(j.error || "Upload failed"); else onChange(j.url);
  }
  return (
    <div><label htmlFor={id} className="label">{f.label}</label>
      <div className="flex gap-2"><input id={id} className={inp} placeholder="https://… or /uploads/…" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        <label className="btn-ghost !min-h-[44px] shrink-0 cursor-pointer !px-4">{busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}<span className="sr-only sm:not-sr-only">Upload</span>
          <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" onChange={(e) => e.target.files?.[0] && up(e.target.files[0])} /></label></div>
      {err && <p className="mt-1 text-sm text-red-700">{err}</p>}
      {f.help && <p className="mt-1 text-xs text-charcoal-400">{f.help}</p>}
      {value && !/\.(mp4|webm)$/.test(value) && /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt="" className="mt-2 h-24 rounded-xl object-cover" />}</div>
  );
}

function Repeater({ f, value, onChange }: { f: FieldDef; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const blank = () => Object.fromEntries((f.sub || []).map((s) => [s.key, defaultFor(s)]));
  const move = (i: number, d: number) => { const a = [...value]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  return (
    <fieldset className="rounded-2xl border border-forest/15 p-4"><legend className="px-2 text-sm font-semibold text-forest">{f.label}</legend>
      <ol className="space-y-4">{value.map((row, i) => (
        <li key={i} className="rounded-2xl bg-ivory p-4">
          <div className="grid gap-3 sm:grid-cols-2">{f.sub!.map((s) => (<div key={s.key} className={s.half ? "" : "sm:col-span-2"}><FieldInput f={s} value={row[s.key]} onChange={(v) => onChange(value.map((r, k) => (k === i ? { ...r, [s.key]: v } : r)))} /></div>))}</div>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn-ghost !min-h-[40px] !px-3" onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp size={14} /></button>
            <button type="button" className="btn-ghost !min-h-[40px] !px-3" onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown size={14} /></button>
            <button type="button" className="btn-ghost !min-h-[40px] !px-3 !text-red-700" onClick={() => onChange(value.filter((_, k) => k !== i))}><Trash2 size={14} />Remove</button></div>
        </li>))}</ol>
      <button type="button" className="btn-primary mt-4 !min-h-[44px]" onClick={() => onChange([...value, blank()])}><Plus size={16} />Add</button>
    </fieldset>
  );
}

function clean(v: any): any {
  if (Array.isArray(v)) return v.map(clean).filter((x) => !(typeof x === "string" && x.trim() === ""));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]));
  return typeof v === "string" ? v.trim() : v;
}

export function EntityForm({ collection, id, initial }: { collection: CollectionName; id?: string; initial: Obj }) {
  const def = COLLECTIONS[collection];
  const router = useRouter();
  const [v, setV] = useState<Obj>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; issues?: string[] } | null>(null);

  async function save() {
    setBusy(true); setMsg(null);
    const body = clean(v); delete body.id;
    if (body.imageUrl === "") delete body.imageUrl;
    const r = await fetch(id ? `/api/admin/entities/${collection}/${id}` : `/api/admin/entities/${collection}`, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setMsg({ ok: false, text: j.error || "Could not save", issues: j.issues }); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (!id) router.push(`/admin/${collection === "tours" ? "tours" : `content/${collection}`}/${j.id}`);
    else { setMsg({ ok: true, text: "Saved. The website updates within moments." }); router.refresh(); }
  }

  async function remove() {
    if (!id || !confirm(`Delete this ${def.singular}? This cannot be undone.`)) return;
    await fetch(`/api/admin/entities/${collection}/${id}`, { method: "DELETE" });
    router.push(collection === "tours" ? "/admin/tours" : `/admin/content/${collection}`);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6">
      {msg && <div role="status" className={`rounded-2xl p-4 text-sm ${msg.ok ? "bg-olive/20 text-forest" : "bg-red-50 text-red-800"}`}>{msg.text}{msg.issues && <ul className="mt-2 list-disc ps-5">{msg.issues.slice(0, 8).map((i) => <li key={i}>{i}</li>)}</ul>}</div>}
      <div className="grid gap-5 sm:grid-cols-2">
        {def.fields.map((f) => (
          <div key={f.key} className={f.half || f.type === "checkbox" && f.half ? "" : "sm:col-span-2"}>
            <FieldInput f={f} value={v[f.key]} onChange={(val) => setV((s) => ({ ...s, [f.key]: val }))} />
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 bg-ivory/95 px-4 py-4 backdrop-blur sm:-mx-0 sm:rounded-2xl">
        {id ? <button type="button" onClick={remove} className="btn-ghost !text-red-700"><Trash2 size={16} />Delete</button> : <span />}
        <button type="submit" disabled={busy} className="btn-gold min-w-[180px]">{busy && <Loader2 size={16} className="animate-spin" />}{id ? "Save changes" : `Create ${def.singular}`}</button>
      </div>
    </form>
  );
}
