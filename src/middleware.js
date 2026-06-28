import { NextResponse } from "next/server";

/**
 * Protected routes যেখানে login ছাড়া access নেই।
 * /classes/[id] এবং /forum/[id] — এই দুটি route protect করা হয়েছে।
 *
 * Better Auth এর cookiePrefix "auragym" অনুযায়ী
 * session cookie এর নাম: "auragym.session_token"
 */

// Protected path patterns
const PROTECTED_PATTERNS = [
  /^\/classes\/[^/]+$/, // /classes/:id
  /^\/forum\/[^/]+$/,   // /forum/:id
  /^\/dashboard(\/.*)?$/, // /dashboard/*
];

// Login page path
const LOGIN_PATH = "/auth/signin";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this path needs protection
  const isProtected = PROTECTED_PATTERNS.some((pattern) =>
    pattern.test(pathname)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Better Auth session cookie check
  // cookiePrefix: "auragym" → cookie name: "auragym.session_token"
  const sessionToken =
    request.cookies.get("auragym.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value;

  if (!sessionToken) {
    // Login নেই → login পেজে redirect করো, callbackUrl সহ
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session আছে → allow করো
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match করবে:
     * - /classes/[id]  (class details - private)
     * - /forum/[id]    (forum post details - private)
     * - /dashboard/*   (dashboard pages - private)
     *
     * Match করবে না (Public):
     * - /classes        (all classes list)
     * - /forum          (forum list)
     * - /_next, /api, static files
     *
     * NOTE: ":id+" মানে অন্তত একটা segment থাকতে হবে।
     *       ফলে /classes এবং /forum list page গুলো public থাকবে।
     */
    "/classes/:id+",
    "/forum/:id+",
    "/dashboard/:path*",
  ],
};
