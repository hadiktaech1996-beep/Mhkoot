import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/small";
import { LogoMark } from "@/components/Logo";

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest-900 p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-ivory p-8 shadow-lift sm:p-10">
        <LogoMark className="h-12 w-12" />
        <h1 className="mt-4 font-display text-4xl font-semibold text-forest">Admin sign in</h1>
        <p className="mt-1 text-sm text-charcoal-500">Sancak Tour management dashboard</p>
        <LoginForm />
      </div>
    </main>
  );
}
