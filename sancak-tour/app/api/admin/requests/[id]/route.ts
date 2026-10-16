import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/auth";
import { mutateDb } from "@/lib/store";

const schema = z.object({ status: z.enum(["new", "in_progress", "quoted", "done", "closed"]).optional(), internalNotes: z.string().max(4000).optional() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const u = await apiUser(req, "requests");
  if (u instanceof NextResponse) return u;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "invalid" }, { status: 422 });
  const found = await mutateDb((db) => {
    const r = db.requests.find((x) => x.id === params.id);
    if (!r) return false;
    Object.assign(r, p.data);
    return true;
  });
  return found ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
