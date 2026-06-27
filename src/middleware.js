import { NextResponse } from 'next/server';

// Private routes that require authentication (any role)
const privateRoutes = [
  '/dashboard',
  '/forum/',       // forum/[id] - Post Details
  '/classes/',     // classes/[id] - Class Details
  '/payment',
];

// Routes accessible only to non-authenticated users (e.g. login/register)
const authOnlyRoutes = ['/auth/signin', '/auth/signup'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if user has a valid better-auth session cookie
  // better-auth stores the session in a cookie with the configured prefix
  const sessionCookie =
    request.cookies.get('auragym_session_token') ||
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-auragym_session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isAuthenticated = !!sessionCookie?.value;

  // Check if this is a private route
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is an auth-only route (signin/signup)
  const isAuthOnlyRoute = authOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. If trying to access a private route without being authenticated,
  //    redirect to sign-in page and remember where they wanted to go
  if (isPrivateRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. If already authenticated and trying to access signin/signup,
  //    redirect them to the home page
  if (isAuthOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     * - api routes (especially /api/auth/* used by better-auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};
