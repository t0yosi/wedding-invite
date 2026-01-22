import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to:
  // - Home page (/)
  // - Invite pages (/invite/*)
  // - Static files (_next, favicon, etc.)
  // - API route for fetching guest by token (/api/guests/[token])
  // - API route for updating RSVP (/api/guests/[token])

  if (
    pathname === '/' ||
    pathname.startsWith('/invite/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    pathname.match(/^\/api\/guests\/[^/]+$/) // matches /api/guests/[token]
  ) {
    return NextResponse.next();
  }

  // For admin page, let it handle its own auth
  if (pathname === '/admin') {
    return NextResponse.next();
  }

  // Protect admin API routes - require Bearer token
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  // All other routes redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
