import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiUser } from "@/lib/auth";
import { mutateDb, newId, type Collection } from "@/lib/store";
import { COLLECTIONS, type CollectionName } from "@/lib/admin/fields";
import { ID_PREFIX, validators } from "@/lib/admin/validators";

export async function POST(req: Request, { params }: { params: { collection: string } }) {
  const name = params.collection as CollectionName;
  const def = COLLECTIONS[name];
  if (!def) return NextResponse.json({ error: "unknown collection" }, { status: 404 });
  const u = await apiUser(req, def.permission);
  if (u instanceof NextResponse) return u;
  const parsed = validators[name].safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }, { status: 422 });
  const data = parsed.data as Record<string, unknown>;
  const id = newId(ID_PREFIX[name]);
  try {
    await mutateDb((db) => {
      const list = db[name as Collection] as unknown as Record<string, unknown>[];
      if (data.slug && list.some((x) => x.slug === data.slug)) throw new Error("That URL name is already used");
      list.push({ id, ...data });
    });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 409 }); }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id });
}
