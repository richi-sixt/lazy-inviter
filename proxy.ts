import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — bypass auth
  if (
    pathname.startsWith("/invite/") ||
    pathname.startsWith("/api/rsvp") ||
    pathname.startsWith("/api/invitations/") ||
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get("lazy-inviter-auth");
  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
