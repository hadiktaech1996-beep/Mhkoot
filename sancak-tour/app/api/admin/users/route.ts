import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/auth";
import { mutateDb, newId } from "@/lib/store";
import { hashPassword } from "@/lib/password";

const schema = z.object({ email: z.string().email().max(200), name: z.string().min(2).max(100), role: z.enum(["owner", "manager", "editor", "support"]), password: z.string().min(12).max(200) });

export async function POST(req: Request) {
  const u = await apiUser(req, "staff");
  if (u instanceof NextResponse) return u;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Email, name, role and a password of at least 12 characters are required." }, { status: 422 });
  try {
    await mutateDb((db) => {
      const email = p.data.email.toLowerCase();
      if (db.users.some((x) => x.email === email)) throw new Error("A user with this email already exists");
      db.users.push({ id: newId("u"), email, name: p.data.name, role: p.data.role, passwordHash: hashPassword(p.data.password), active: true, createdAt: new Date().toISOString() });
    });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 409 }); }
  return NextResponse.json({ ok: true });
}
