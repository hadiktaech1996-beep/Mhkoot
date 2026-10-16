import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureOwner } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { hashPassword, verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const DUMMY = hashPassword("dummy-password-for-timing");
const schema = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const email = body.data.email.toLowerCase();
  if (!rateLimit(`login-email:${email}`, 8, 15 * 60_000)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });

  const ready = await ensureOwner();
  if (!ready) return NextResponse.json({ error: "Admin is not configured: set ADMIN_EMAIL and ADMIN_PASSWORD (min 12 characters) on the server." }, { status: 503 });

  const user = readDb().users.find((u) => u.email === email && u.active);
  const ok = verifyPassword(body.data.password, user?.passwordHash || DUMMY) && !!user; // always hash-compare → no user enumeration by timing
  if (!ok || !user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await signSession(user.id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE });
  return res;
}
