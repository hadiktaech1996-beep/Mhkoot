import { NextResponse } from "next/server";
import { apiUser } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { toCsv } from "@/lib/csv";

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type") || "bookings";
  const u = await apiUser(req, type === "requests" ? "requests" : "bookings");
  if (u instanceof NextResponse) return u;
  const db = readDb();
  let csv = "";
  if (type === "requests") {
    const cols = ["ref", "createdAt", "type", "status", "lang", "name", "email", "phone", "details", "internalNotes"];
    csv = toCsv(db.requests.map((r) => ({ ...r, details: Object.entries(r.data).map(([k, v]) => `${k}: ${v}`).join(" | ") })), cols);
  } else {
    const cols = ["ref", "createdAt", "status", "paymentStatus", "paymentMethod", "tourTitle", "date", "adults", "children", "mode", "extras", "promoCode", "discount", "total", "currency", "lang", "name", "email", "phone", "country", "notes", "internalNotes", "sample"];
    csv = toCsv(db.bookings.map((b) => ({ ...b, extras: b.extras.map((e) => e.label).join("; "), name: b.customer.name, email: b.customer.email, phone: b.customer.phone, country: b.customer.country, notes: b.customer.notes })), cols);
  }
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="sancak-${type}-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
}
