import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const securePaths = [
  // "/home",
  "/messaging",
  "/voice",
  "/phone-numbers",
  "/settings/:path*",
];
const publicPaths = [
  "/login",
  "/two-factor-login",
  "/email-verification",
  "/backup-codes",
  "/forgot-password",
  "/manually-email-verification",
  "/password-reset",
  "/register/:path*",
  "/two-factor-authentication",
  "/verify-user",
];

export function middleware(request: NextRequest) {
  // WITH COOKIE APPROCH
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth-token")?.value;

  // for root page
  if (!token && pathname === "/") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  if (token && pathname === "/") {
    const dashboardUrl = new URL("/phone-numbers", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // for auth & dashboard pages
  if (securePaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (token && token !== undefined && token !== null && token !== "") {
      const dashboardUrl = new URL("/phone-numbers", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    //add routes for this middlewere work
    "/",
    "/login",
    "/two-factor-login",
    "/email-verification",
    "/backup-codes",
    "/forgot-password",
    "/manually-email-verification",
    "/password-reset",
    "/register/:path*",
    "/two-factor-authentication",
    "/verify-user",
    // add all protected routes
    // "/home",
    "/messaging",
    "/phone-numbers",
    "/settings/:path*",
  ],
};
