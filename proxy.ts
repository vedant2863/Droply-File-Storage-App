import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "./lib/auth/jwt";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./lib/auth/cookies";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  // Verify access token (lightweight jose verification)
  const isAccessValid = accessToken ? Boolean(await verifyAccessToken(accessToken)) : false;
  const isRefreshValid = refreshToken ? Boolean(await verifyRefreshToken(refreshToken)) : false;
  const isAuthenticated = isAccessValid || isRefreshValid;

  // 1. Authenticated users should not access /sign-in or /sign-up
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protected dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // 3. Protected internal API routes
  if (
    pathname.startsWith("/api/files") ||
    pathname.startsWith("/api/folders") ||
    pathname.startsWith("/api/auth/me")
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, SVGs, and public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

