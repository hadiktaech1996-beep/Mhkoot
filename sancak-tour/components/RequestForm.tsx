"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Lang } from "@/lib/i18n/config";
import type { Field } from "@/lib/forms";

interface Labels { submit: string; success: string; successNote: string; consent: string; privacy: string; error: string; ref: string; required: string }

/** Generic, accessible request form used for contact, transfer, VIP and accommodation inquiries. Validated again on the server. */
export function RequestForm({ type, lang, fields, labels, prefill = {} }: { type: "contact" | "transfer" | "vip" | "accommodation"; lang: Lang; fields: Field[]; labels: Labels; prefill?: Record<string, string> }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [ref, setRef] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, boolean> = {};
    const body: any = { type, lang, data: {}, consent: fd.get("consent") === "on", website: String(fd.get("website") || "") };
    for (const f of fields) {
      let v: string;
      if (f.type === "checkboxes") v = fd.getAll(f.key).join(", ");
      else v = String(fd.get(f.key) ?? "").trim();
      if (f.required && !v) errs[f.key] = true;
      if (f.top) body[f.top] = v; else if (v) body.data[f.key] = v;
    }
    if (!body.consent) errs.consent = true;
    setErrors(errs);
    if (Object.keys(errs).length) { formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(); return; }
    setState("sending");
    try {
      const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg(json?.error === "rate_limited" ? "…" : labels.error); setState("error"); return; }
      setRef(json.ref); setState("done");
    } catch { setMsg(labels.error); setState("error"); }
  }

  if (state === "done") {
    return (
      <div role="status" className="mt-6 rounded-3xl bg-olive/15 p-8 text-center">
        <CheckCircle2 className="mx-auto text-olive-700" size={44} aria-hidden />
        <h3 className="mt-3 font-display text-2xl font-semibold text-forest">{labels.success}</h3>
        <p className="mt-2 text-sm text-charcoal-500">{labels.successNote}</p>
        <p className="mt-4 text-sm"><span className="text-charcoal-400">{labels.ref}: </span><b className="font-mono text-forest">{ref}</b></p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
      {/* honeypot: real visitors never see or fill this */}
      <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" name="website" /></label></div>
      {fields.map((f) => {
        const id = `${type}-${f.key}`;
        const wide = !f.half;
        const common = { id, name: f.key, required: f.required, "aria-invalid": errors[f.key] ? true : undefined, "aria-describedby": errors[f.key] ? `${id}-err` : undefined, autoComplete: f.autoComplete, className: "field" } as const;
        const dv = prefill[f.key] ?? f.defaultValue ?? "";
        return (
          <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
            {f.type === "checkboxes" ? (
              <fieldset><legend className="label">{f.label}</legend>
                <div className="flex flex-wrap gap-2">{f.options?.map((o) => (
                  <label key={o.value} className="chip cursor-pointer !px-4 !py-2 text-sm has-[:checked]:bg-forest has-[:checked]:text-ivory"><input type="checkbox" name={f.key} value={o.value} className="sr-only" />{o.label}</label>
                ))}</div></fieldset>
            ) : (
              <>
                <label htmlFor={id} className="label">{f.label}{f.required && <span className="text-red-700" aria-hidden> *</span>}</label>
                {f.type === "textarea" ? <textarea {...common} rows={4} defaultValue={dv} maxLength={2000} />
                  : f.type === "select" ? <select {...common} defaultValue={dv}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  : <input {...common} type={f.type} defaultValue={dv} min={f.min} max={f.max} maxLength={200} dir={f.type === "email" || f.type === "tel" ? "ltr" : undefined} />}
              </>
            )}
            {errors[f.key] && <p id={`${id}-err`} className="mt-1 text-sm text-red-700">{labels.required}</p>}
          </div>
        );
      })}
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-charcoal-500">
          <input type="checkbox" name="consent" aria-invalid={errors.consent ? true : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-forest" />
          <span>{labels.consent} <Link href={`/${lang}/legal/privacy`} className="font-medium text-forest underline underline-offset-4">{labels.privacy}</Link></span>
        </label>
        {errors.consent && <p className="mt-1 text-sm text-red-700">{labels.required}</p>}
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="btn-primary w-full sm:w-auto sm:min-w-[220px]">
          {state === "sending" && <Loader2 size={18} className="animate-spin" aria-hidden />}{labels.submit}
        </button>
        {state === "error" && <p role="alert" className="mt-3 text-sm text-red-700">{msg || labels.error}</p>}
      </div>
    </form>
  );
}
