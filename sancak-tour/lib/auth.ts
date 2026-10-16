import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "./session";
import { mutateDb, newId, readDb } from "./store";
import { hashPassword } from "./password";
import { ROLE_PERMISSIONS, type Permission, type User } from "./types";

/** Create the first owner account if none exists. Production requires ADMIN_EMAIL + ADMIN_PASSWORD. */
export async function ensureOwner(): Promise<boolean> {
  if (readDb().users.length > 0) return true;
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    if (process.env.NODE_ENV === "production") return false;
    email = "owner@sancaktour.local";
    password = "change-me-now-dev-only";
    console.warn(`[admin] DEV ONLY: created default owner ${email} / ${password}. Set ADMIN_EMAIL and ADMIN_PASSWORD.`);
  }
  if (password.length < 12) return false;
  const user: User = {
    id: newId("u"), email: email.toLowerCase(), name: "Owner", role: "owner",
    passwordHash: hashPassword(password), active: true, createdAt: new Date().toISOString(),
  };
  await mutateDb((db) => { if (db.users.length === 0) db.users.push(user); });
  return true;
}

export async function currentUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const s = await verifySession(token);
  if (!s) return null;
  const u = readDb().users.find((x) => x.id === s.uid && x.active);
  return u || null;
}

export const can = (u: User | null, p: Permission) => !!u && ROLE_PERMISSIONS[u.role].includes(p);

/** For server components / pages. */
export async function requireUser(permission?: Permission): Promise<User> {
  const u = await currentUser();
  if (!u) redirect("/admin/login");
  if (permission && !can(u, permission)) redirect("/admin?denied=1");
  return u;
}

/** For route handlers. Returns the user or a ready-made error response. */
export async function apiUser(req: Request, permission?: Permission): Promise<User | NextResponse> {
  const origin = req.headers.get("origin");
  if (req.method !== "GET" && origin) {
    const host = req.headers.get("host");
    try { if (new URL(origin).host !== host) return NextResponse.json({ error: "bad_origin" }, { status: 403 }); } catch { return NextResponse.json({ error: "bad_origin" }, { status: 403 }); }
  }
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (permission && !can(u, permission)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return u;
}
