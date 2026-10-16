import { ImageResponse } from "next/og";

export const runtime = "edge";

/** Language-neutral brand card used as the default Open Graph image. Replace with a licensed photo card when available. */
export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, background: "linear-gradient(135deg,#213D32 0%,#12251D 70%)", color: "#F8F6EF" }}>
        <div style={{ display: "flex", width: 120, height: 8, background: "#D6B977", marginBottom: 28 }} />
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: 8 }}>SANCAK TOURS</div>
        <div style={{ fontSize: 38, marginTop: 14, color: "#D6B977" }}>Bosnia &amp; Herzegovina · Balkans</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
