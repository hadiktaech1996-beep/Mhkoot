import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import "@fontsource-variable/inter";
import "../globals.css";
import { currentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/Shell";

export const metadata: Metadata = { title: "Sancak Tour · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <html lang="en" dir="ltr">
      <body>{user ? <AdminShell user={user}>{children}</AdminShell> : children}</body>
    </html>
  );
}
