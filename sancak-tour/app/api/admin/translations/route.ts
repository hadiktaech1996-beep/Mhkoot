import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiUser } from "@/lib/auth";
import { mutateDb } from "@/lib/store";
import { DICTS, flatten } from "@/lib/i18n";
import { isLang } from "@/lib/i18n/config";

const schema = z.object({ lang: z.string().refine(isLang), path: z.string().max(120), value: z.string().max(5000).nullable() });

export async function PUT(req: Request) {
  const u = await apiUser(req, "translations");
  if (u instanceof NextResponse) return u;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "invalid" }, { status: 422 });
  const { lang, path, value } = p.data;
  const base = flatten(DICTS[lang as "en"]);
  if (!(path in base)) return NextResponse.json({ error: "unknown key" }, { status: 404 });
  await mutateDb((db) => {
    const k = `${lang}:${path}`;
    if (value === null || value === base[path]) delete db.translations[k];
    else db.translations[k] = value;
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
