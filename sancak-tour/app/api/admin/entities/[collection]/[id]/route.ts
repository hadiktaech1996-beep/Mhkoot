import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiUser } from "@/lib/auth";
import { mutateDb, type Collection } from "@/lib/store";
import { COLLECTIONS, type CollectionName } from "@/lib/admin/fields";
import { validators } from "@/lib/admin/validators";

export async function PUT(req: Request, { params }: { params: { collection: string; id: string } }) {
  const name = params.collection as CollectionName;
  const def = COLLECTIONS[name];
  if (!def) return NextResponse.json({ error: "unknown collection" }, { status: 404 });
  const u = await apiUser(req, def.permission);
  if (u instanceof NextResponse) return u;
  const parsed = validators[name].safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }, { status: 422 });
  const data = parsed.data as Record<string, unknown>;
  try {
    await mutateDb((db) => {
      const list = db[name as Collection] as unknown as Record<string, unknown>[];
      const i = list.findIndex((x) => x.id === params.id);
      if (i < 0) throw new Error("Not found");
      if (data.slug && list.some((x) => x.slug === data.slug && x.id !== params.id)) throw new Error("That URL name is already used");
      list[i] = { ...list[i], ...data, id: params.id };
    });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 409 }); }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { collection: string; id: string } }) {
  const name = params.collection as CollectionName;
  const def = COLLECTIONS[name];
  if (!def) return NextResponse.json({ error: "unknown collection" }, { status: 404 });
  const u = await apiUser(req, def.permission);
  if (u instanceof NextResponse) return u;
  await mutateDb((db) => {
    const list = db[name as Collection] as unknown as { id: string }[];
    const i = list.findIndex((x) => x.id === params.id);
    if (i >= 0) list.splice(i, 1);
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
