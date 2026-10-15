import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve(process.cwd(), process.env.DATA_DIR || ".data", "uploads");
const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", mp4: "video/mp4", webm: "video/webm" };

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const name = params.path.join("/");
  if (!/^[\w.-]+\.(jpg|png|webp|avif|mp4|webm)$/.test(name)) return new Response("Not found", { status: 404 });
  const file = path.join(DIR, name);
  if (!file.startsWith(DIR + path.sep) || !fs.existsSync(file)) return new Response("Not found", { status: 404 });
  const ext = name.split(".").pop()!;
  return new Response(fs.readFileSync(file), { headers: { "Content-Type": MIME[ext], "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}
