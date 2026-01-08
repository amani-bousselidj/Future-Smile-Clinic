import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ACCESS_COOKIE = "fsc_admin_access";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page and Next.js internals.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasAccess = Boolean(req.cookies.get(ADMIN_ACCESS_COOKIE)?.value);
  if (!hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
