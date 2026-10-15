import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/auth";
import { mutateDb } from "@/lib/store";

const schema = z.object({
  status: z.enum(["pending", "confirmed", "paid", "cancelled", "completed"]).optional(),
  paymentStatus: z.enum(["unpaid", "awaiting", "paid", "refunded"]).optional(),
  internalNotes: z.string().max(4000).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const u = await apiUser(req, "bookings");
  if (u instanceof NextResponse) return u;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "invalid" }, { status: 422 });
  const found = await mutateDb((db) => {
    const b = db.bookings.find((x) => x.id === params.id);
    if (!b) return false;
    Object.assign(b, p.data);
    return true;
  });
  return found ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
