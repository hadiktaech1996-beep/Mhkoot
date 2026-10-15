import type { L, LList } from "../i18n/config";

/** Build a translated string: l(en, tr, ar, de) */
export const l = (en: string, tr: string, ar: string, de: string): L => ({ en, tr, ar, de });
export const ll = (en: string[], tr: string[], ar: string[], de: string[]): LList => ({ en, tr, ar, de });
