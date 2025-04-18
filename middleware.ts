import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that are publicly accessible without authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/api/auth',
  '/api/shipdelight/generate-token',
  '/api/shipdelight/track-order'
];

// Middleware to check authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path)) || 
      pathname.includes('/_next') || 
      pathname.includes('/favicon.ico') ||
      pathname.includes('/assets/')) {
    return NextResponse.next();
  }

  // Check if the user has an active session via cookies
  const hasFirebaseAuthCookie = request.cookies.has('firebase-auth-token');
  const hasUserCookie = request.cookies.has('user-data');
  
  // If no auth cookies, redirect to login
  if (!hasFirebaseAuthCookie && !hasUserCookie) {
    // Redirect to login
    const loginUrl = new URL('/login', request.url);
    // Pass the current URL as a query parameter to redirect back after login
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Continue to the protected route
  return NextResponse.next();
}

// Configure the paths that this middleware will run on
export const config = {
  matcher: [
    // Match all paths except for the ones used for static assets
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
}; 