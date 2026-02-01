import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Middleware for protecting routes and managing authentication
 * - Refreshes session tokens
 * - Redirects unauthenticated users to login
 * - Redirects authenticated users away from auth pages
 */
export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client using SSR helper
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
    }
  );

  // Refresh user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes (accessible without authentication)
  const publicRoutes = ['/login', '/register', '/invite'];
  const isPublicRoute = publicRoutes.some((route) => requestUrl.pathname.startsWith(route));

  // Protected routes (require authentication)
  const isProtectedRoute =
    requestUrl.pathname.startsWith('/client') ||
    requestUrl.pathname.startsWith('/vigidev') ||
    requestUrl.pathname === '/';

  // If user is authenticated and trying to access auth pages, redirect to home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!user && isProtectedRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all routes except:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder files
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
