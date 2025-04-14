import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session cookie to check if the user is authenticated
  const sessionCookie = request.cookies.get('session')?.value;
  const isAuthenticated = !!sessionCookie;

  // Public paths that don't require authentication
  const publicPaths = ['/welcome', '/sign-in', '/sign-up', '/forgot-password'];
  
  // Paths that require authentication
  const authPaths = ['/home', '/profile', '/settings', '/feedback', '/session', '/progress', '/conversations'];
  
  // Check if the current path is a protected path
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => pathname === path);
  
  // Root path should redirect to welcome for first-time visitors, or home for logged-in users
  if (pathname === '/') {
    return isAuthenticated 
      ? NextResponse.redirect(new URL('/home', request.url))
      : NextResponse.redirect(new URL('/welcome', request.url));
  }
  
  // If user is trying to access a protected path without being authenticated
  if (isAuthPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Optional: If authenticated user tries to access sign-in/sign-up, redirect to home
  if (isAuthenticated && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // For all other routes, continue normal request handling
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}; 