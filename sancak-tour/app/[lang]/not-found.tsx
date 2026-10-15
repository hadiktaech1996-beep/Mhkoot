import Link from "next/link";
import { headers } from "next/headers";
import { isLang, DEFAULT_LANG } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";

export default function NotFound() {
  const seg = (headers().get("x-pathname") || "").split("/")[1];
  const lang = isLang(seg) ? seg : DEFAULT_LANG;
  const d = getDict(lang);
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pb-20 pt-40 text-center">
      <p className="font-display text-8xl font-bold text-gold">404</p>
      <h1 className="h-section mt-4">{d.errors.notFound}</h1>
      <p className="lead mt-3 max-w-md">{d.errors.notFoundText}</p>
      <Link href={`/${lang}`} className="btn-primary mt-8">{d.errors.home}</Link>
    </section>
  );
}
