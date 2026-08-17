import { NextResponse } from 'next/server';


export function proxy() {
  // Authentication has been removed. All routes are public.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
