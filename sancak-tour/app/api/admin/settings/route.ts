import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiUser, can } from "@/lib/auth";
import { mutateDb } from "@/lib/store";
import { zL } from "@/lib/admin/validators";

const https = z.string().max(300).regex(/^(https:\/\/[^\s]+)?$/, "must start with https://");
const media = z.string().max(500).regex(/^(\/uploads\/[\w.\-]+|https:\/\/[^\s]+)?$/);

const sections = {
  general: z.object({
    company: z.object({ name: z.string().max(120), email: z.string().email().or(z.literal("")), phone: z.string().max(40), address: z.string().max(300), legalInfoPending: z.boolean() }),
    whatsappNumber: z.string().regex(/^\d{7,15}$/, "digits only, international format, e.g. 38761123456").or(z.literal("")),
    social: z.object({ instagram: https, facebook: https, tiktok: https, youtube: https }),
    analytics: z.object({ gaId: z.string().regex(/^(G-[A-Z0-9]{4,20})?$/, "looks like G-XXXXXXXXXX"), searchConsole: z.string().max(200).regex(/^[\w-]*$/) }),
    heroImage: media, heroVideo: media, showDemoReviews: z.boolean(),
  }),
  homepage: z.object({ homepage: z.record(z.string().max(30), z.boolean()) }),
  seo: z.object({ seo: z.record(z.string().max(30), z.object({ title: zL, description: zL })) }),
  payments: z.object({ payments: z.object({ mode: z.enum(["test", "live"]), card: z.boolean(), paypal: z.boolean(), bank: z.boolean(), arrival: z.boolean(), bankDetails: z.string().max(1000) }) }),
} as const;

export async function PUT(req: Request) {
  const u = await apiUser(req); // authenticate first, before looking at the payload
  if (u instanceof NextResponse) return u;
  const body = await req.json().catch(() => null);
  const section = body?.section as keyof typeof sections;
  if (!sections[section]) return NextResponse.json({ error: "unknown section" }, { status: 400 });
  if (!can(u, section === "payments" ? "payments" : "settings")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = sections[section].safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }, { status: 422 });
  await mutateDb((db) => { Object.assign(db.settings, parsed.data); });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
