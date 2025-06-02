import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for auth callback routes to prevent redirect loops
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  // Skip middleware for static files and API routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Vérifier la session
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] ${req.nextUrl.pathname}`, {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        error: error?.message,
        cookieCount: req.cookies.size,
        supabaseCookies: Array.from(req.cookies).filter(([name]) => name.includes('supabase')).map(([name, cookie]) => `${name}=${cookie.value.substring(0, 20)}...`),
        allCookieNames: Array.from(req.cookies).map(([name]) => name)
      });
    }

    // Routes protégées qui nécessitent une authentification
    const protectedRoutes = [
      '/profil',
      '/mes-annonces',
      '/favoris',
      '/messages',
      '/parametres',
      '/complete-profile'
    ];

    // Routes d'authentification (rediriger si déjà connecté)
    const authRoutes = ['/login', '/register'];

    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
    if (isProtectedRoute && !session) {
      console.log(`[Middleware] Redirecting to login - no session for ${req.nextUrl.pathname}`);
      console.log(`[Middleware] Session details:`, {
        session: !!session,
        error: error?.message,
        cookieCount: req.cookies.size,
        userAgent: req.headers.get('user-agent')?.substring(0, 50)
      });
      
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect_to', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Si l'utilisateur est connecté et tente d'accéder aux pages de connexion/inscription
    if (isAuthRoute && session) {
      console.log(`[Middleware] Redirecting to home - already authenticated`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Refresh the session if we have one
    if (session) {
      const {
        data: { session: refreshedSession },
      } = await supabase.auth.getSession();
      
      // Update the response with any new session data
      res = NextResponse.next({
        request: {
          headers: req.headers,
        },
      });
    }

    return res;

  } catch (error) {
    console.error('[Middleware] Error:', error);
    
    // If there's an error with auth, allow the request to continue
    // The client-side auth context will handle the actual authentication
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 