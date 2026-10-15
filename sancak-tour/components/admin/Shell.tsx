import Link from "next/link";
import { BarChart3, BookOpen, CalendarCheck, Car, Languages, Settings, ShieldCheck, Tag, Users, UserRound, MapPinned, FileText, BedDouble, Mail, ExternalLink } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { LogoutButton } from "./small";
import { ROLE_PERMISSIONS, type Permission, type User } from "@/lib/types";

const NAV: { href: string; label: string; icon: any; perm: Permission }[] = [
  { href: "/admin", label: "Dashboard", icon: BarChart3, perm: "bookings" },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, perm: "bookings" },
  { href: "/admin/requests", label: "Requests & transfers", icon: Mail, perm: "requests" },
  { href: "/admin/customers", label: "Customers", icon: UserRound, perm: "bookings" },
  { href: "/admin/tours", label: "Tours & prices", icon: MapPinned, perm: "tours" },
  { href: "/admin/content/extras", label: "Add-ons", icon: Tag, perm: "tours" },
  { href: "/admin/content/promotions", label: "Promotions", icon: Tag, perm: "tours" },
  { href: "/admin/content/accommodations", label: "Accommodation", icon: BedDouble, perm: "content" },
  { href: "/admin/content/vehicles", label: "Vehicles", icon: Car, perm: "content" },
  { href: "/admin/content/posts", label: "Blog articles", icon: BookOpen, perm: "content" },
  { href: "/admin/translations", label: "Translations", icon: Languages, perm: "translations" },
  { href: "/admin/settings", label: "Settings & SEO", icon: Settings, perm: "settings" },
  { href: "/admin/staff", label: "Staff & permissions", icon: Users, perm: "staff" },
];

export function AdminShell({ user, children }: { user: User; children: React.ReactNode }) {
  const allowed = ROLE_PERMISSIONS[user.role];
  const items = NAV.filter((n) => allowed.includes(n.perm));
  const nav = (
    <nav aria-label="Admin" className="space-y-1">
      {items.map((n) => { const Icon = n.icon; return <Link key={n.href} href={n.href} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm text-ivory/80 transition hover:bg-white/10 hover:text-white"><Icon size={18} aria-hidden />{n.label}</Link>; })}
    </nav>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden bg-forest-900 p-5 text-ivory lg:flex lg:flex-col lg:gap-6">
        <Link href="/admin" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-wider"><LogoMark className="h-9 w-9" />SANCAK ADMIN</Link>
        {nav}
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <a href="/en" target="_blank" className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm text-ivory/75 hover:bg-white/10"><ExternalLink size={18} />View website</a>
          <p className="px-3 text-xs text-ivory/50">{user.name} · {user.role}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="min-w-0">
        <details className="bg-forest-900 p-4 text-ivory lg:hidden"><summary className="flex min-h-[44px] cursor-pointer items-center gap-2 font-semibold"><LogoMark className="h-8 w-8" />SANCAK ADMIN · Menu</summary><div className="mt-3">{nav}<div className="mt-3 border-t border-white/10 pt-3"><LogoutButton /></div></div></details>
        <main id="main" className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-display text-4xl font-semibold text-forest">{title}</h1>{sub && <p className="mt-1 max-w-2xl text-sm text-charcoal-500">{sub}</p>}</div>
      {action}
    </div>
  );
}
