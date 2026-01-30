import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/auth/middleware';

/**
 * Middleware to refresh auth session and protect routes
 */
export async function middleware(request: NextRequest) {
  // Refresh the auth session if it exists
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
