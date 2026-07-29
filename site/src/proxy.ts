import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isSessionTokenValid } from "@/lib/admin-auth";

/**
 * Gate for everything under /admin and /api/admin.
 *
 * Next 16 renamed Middleware to Proxy and moved it to the Node.js runtime by
 * default, which is why `crypto` inside admin-auth works here at all.
 *
 * The Next docs are explicit that Proxy should not be the only authorisation
 * check, so the admin pages and the mark-paid route verify the session again
 * themselves. This layer exists to bounce visitors early, not to be the
 * security boundary on its own.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page has to stay reachable or there is no way back in.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (isSessionTokenValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.next();
  }

  // API routes get a plain 401 instead of an HTML redirect, so a fetch from the
  // admin UI fails with something readable rather than a login page as JSON.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
