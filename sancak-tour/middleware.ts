import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, isLang } from "@/lib/i18n/config";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Admin area: signed session cookie required (fine-grained permissions are checked per page / API call).
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (isLang(first)) {
    const headers = new Headers(req.headers);
    headers.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers } });
  }

  // Locale-less URL → remembered language (cookie) or English. We never auto-redirect by browser language;
  // a dismissible banner suggests it instead.
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  const lang = isLang(cookie) ? cookie : "en";
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|og|uploads|.*\\..*).*)"],
};
