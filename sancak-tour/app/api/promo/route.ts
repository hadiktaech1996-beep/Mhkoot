import { NextResponse } from "next/server";
import { getPromo } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  if (!rateLimit(`promo:${clientIp(req)}`, 20, 10 * 60_000)) return NextResponse.json({ ok: false }, { status: 429 });
  const code = new URL(req.url).searchParams.get("code") || "";
  const p = code.length < 40 ? getPromo(code) : undefined;
  return NextResponse.json(p ? { ok: true, percent: p.percent, code: p.code } : { ok: false });
}
