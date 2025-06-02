import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/sign-in") ||
                    request.nextUrl.pathname.startsWith("/sign-up") ||
                    request.nextUrl.pathname.startsWith("/forgot-password");

  if (!token && !isAuthPage && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auditions/:path*",
    "/expenses/:path*",
    "/services/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
  ],
};