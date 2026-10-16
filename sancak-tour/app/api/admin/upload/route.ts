import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { apiUser } from "@/lib/auth";

const DIR = path.resolve(process.cwd(), process.env.DATA_DIR || ".data", "uploads");
const TYPES: Record<string, { ext: string; max: number; magic: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: "jpg", max: 12e6, magic: (b) => b[0] === 0xff && b[1] === 0xd8 },
  "image/png": { ext: "png", max: 12e6, magic: (b) => b.subarray(1, 4).toString() === "PNG" },
  "image/webp": { ext: "webp", max: 12e6, magic: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
  "image/avif": { ext: "avif", max: 12e6, magic: (b) => b.subarray(4, 8).toString() === "ftyp" },
  "video/mp4": { ext: "mp4", max: 80e6, magic: (b) => b.subarray(4, 8).toString() === "ftyp" },
  "video/webm": { ext: "webm", max: 80e6, magic: (b) => b[0] === 0x1a && b[1] === 0x45 },
};

export async function POST(req: Request) {
  const u = await apiUser(req, "tours");
  if (u instanceof NextResponse) return u;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const t = TYPES[file.type];
  if (!t) return NextResponse.json({ error: "Only JPG, PNG, WebP, AVIF, MP4 or WebM files are allowed" }, { status: 415 });
  if (file.size > t.max) return NextResponse.json({ error: "File is too large" }, { status: 413 });
  const buf = Buffer.from(await file.arrayBuffer());
  if (!t.magic(buf)) return NextResponse.json({ error: "File content does not match its type" }, { status: 415 });
  fs.mkdirSync(DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${t.ext}`;
  fs.writeFileSync(path.join(DIR, name), buf);
  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
