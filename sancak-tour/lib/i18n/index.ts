import { en, type Dict } from "./en";
import { tr } from "./tr";
import { ar } from "./ar";
import { de } from "./de";
import type { Lang } from "./config";

export const DICTS: Record<Lang, Dict> = { en, tr, ar, de };
export type { Dict };

/** Flatten a dictionary to dot-path keys (arrays use numeric indexes). */
export function flatten(obj: unknown, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (typeof obj === "string") {
    out[prefix] = obj;
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

function setPath(target: any, path: string, value: string) {
  const parts = path.split(".");
  let cur = target;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur?.[parts[i]];
    if (cur == null) return;
  }
  const last = parts[parts.length - 1];
  if (cur && last in cur) cur[last] = value;
}

/** Dictionary with admin-edited overrides applied. Overrides are keyed `${lang}:${path}`. */
export function getDictWith(lang: Lang, overrides: Record<string, string> = {}): Dict {
  const base = DICTS[lang];
  const keys = Object.keys(overrides).filter((k) => k.startsWith(lang + ":"));
  if (!keys.length) return base;
  const copy: Dict = JSON.parse(JSON.stringify(base));
  for (const k of keys) setPath(copy, k.slice(lang.length + 1), overrides[k]);
  return copy;
}
