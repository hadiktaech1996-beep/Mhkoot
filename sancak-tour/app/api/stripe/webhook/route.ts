import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/payments";
import { mutateDb } from "@/lib/store";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  const payload = await req.text();
  if (!verifyStripeSignature(payload, req.headers.get("stripe-signature"), secret)) return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  const event = JSON.parse(payload);
  if (event.type === "checkout.session.completed" && event.data?.object?.payment_status === "paid") {
    const bookingId = event.data.object.metadata?.booking_id;
    await mutateDb((db) => {
      const b = db.bookings.find((x) => x.id === bookingId);
      if (b && b.paymentStatus !== "paid") { b.paymentStatus = "paid"; b.status = "paid"; }
    });
  }
  return NextResponse.json({ received: true });
}
