import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the path starts with /pages/dashboard
  if (request.nextUrl.pathname.startsWith('/pages/dashboard')) {
    // Check if auth token exists in cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      // If no token, redirect to login page
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/pages/dashboard/:path*'],
};
