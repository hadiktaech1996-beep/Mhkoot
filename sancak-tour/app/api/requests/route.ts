import { NextResponse } from "next/server";
import { z } from "zod";
import { mutateDb, newId, readDb } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { esc, sendMail } from "@/lib/mail";
import { isLang } from "@/lib/i18n/config";
import type { RequestItem } from "@/lib/types";

const schema = z.object({
  type: z.enum(["contact", "transfer", "vip", "accommodation"]),
  lang: z.string().refine(isLang),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  consent: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
  data: z.record(z.string().max(60), z.union([z.string().max(2000), z.number()])).refine((o) => Object.keys(o).length <= 30),
});

export async function POST(req: Request) {
  if (!rateLimit(`req:${clientIp(req)}`, 8, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // honeypot hit → pretend success so bots learn nothing
    if ((json as any)?.website) return NextResponse.json({ ok: true, ref: "SR-000000" });
    return NextResponse.json({ error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  }
  const v = parsed.data;
  const item: RequestItem = {
    id: newId("r"), ref: `SR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, type: v.type, createdAt: new Date().toISOString(),
    status: "new", lang: v.lang, name: v.name, email: v.email, phone: v.phone, data: v.data,
  };
  await mutateDb((db) => { db.requests.unshift(item); });

  const rows = Object.entries(v.data).map(([k, val]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td>${esc(val)}</td></tr>`).join("");
  const notify = process.env.MAIL_NOTIFY_TO || readDb().settings.company.email;
  if (notify) {
    await sendMail({
      to: notify, replyTo: v.email, subject: `[Sancak Tour] New ${v.type} request ${item.ref}`,
      html: `<p><b>${esc(v.name)}</b> · ${esc(v.email)} · ${esc(v.phone)} · ${esc(v.lang)}</p><table>${rows}</table>`,
      text: `${v.name} ${v.email} ${v.phone}\n` + Object.entries(v.data).map(([k, val]) => `${k}: ${val}`).join("\n"),
    });
  }
  return NextResponse.json({ ok: true, ref: item.ref });
}
