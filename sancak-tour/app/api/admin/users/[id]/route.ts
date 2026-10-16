import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/auth";
import { mutateDb } from "@/lib/store";
import { hashPassword } from "@/lib/password";

const schema = z.object({ role: z.enum(["owner", "manager", "editor", "support"]).optional(), active: z.boolean().optional(), name: z.string().min(2).max(100).optional(), password: z.string().min(12).max(200).optional() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const me = await apiUser(req, "staff");
  if (me instanceof NextResponse) return me;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "invalid (passwords need 12+ characters)" }, { status: 422 });
  try {
    await mutateDb((db) => {
      const t = db.users.find((x) => x.id === params.id);
      if (!t) throw new Error("Not found");
      const owners = db.users.filter((x) => x.role === "owner" && x.active).length;
      const losesOwner = t.role === "owner" && t.active && ((p.data.role && p.data.role !== "owner") || p.data.active === false);
      if (losesOwner && owners <= 1) throw new Error("There must always be at least one active owner");
      if (t.id === me.id && p.data.active === false) throw new Error("You cannot deactivate your own account");
      if (p.data.role) t.role = p.data.role;
      if (p.data.active !== undefined) t.active = p.data.active;
      if (p.data.name) t.name = p.data.name;
      if (p.data.password) t.passwordHash = hashPassword(p.data.password);
    });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 409 }); }
  return NextResponse.json({ ok: true });
}
