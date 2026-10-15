import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { DICTS, flatten } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/config";
import { AdminTitle } from "@/components/admin/Shell";
import { TranslationsEditor } from "@/components/admin/TranslationsEditor";

export default async function TranslationsPage() {
  await requireUser("translations");
  const over = readDb().translations;
  const flat = Object.fromEntries(LOCALES.map((l) => [l, flatten(DICTS[l])]));
  const rows = Object.keys(flat.en).filter((p) => !p.startsWith("meta.siteName")).map((path) => ({
    path, en: flat.en[path],
    values: Object.fromEntries(LOCALES.map((l) => [l, over[`${l}:${path}`] ?? flat[l][path] ?? ""])),
    edited: Object.fromEntries(LOCALES.map((l) => [l, `${l}:${path}` in over])),
  }));
  return (<><AdminTitle title="Translations" sub="Edit any text on the website in Arabic, Turkish, English or German — navigation, forms, FAQs, emails and legal pages. Have a native speaker review important texts." /><TranslationsEditor rows={rows} /></>);
}
