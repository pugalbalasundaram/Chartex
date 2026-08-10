import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check for the access_token in cookies.
  // NOTE: This assumes the backend sets the token in an HttpOnly cookie named 'access_token' upon login.
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isPublicPage = pathname === '/' || isAuthPage;

  if (isPublicPage) {
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
