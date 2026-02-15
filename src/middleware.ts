import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that do NOT require authentication
const PUBLIC_ROUTES = new Set([
  '/',
  '/pricing',
  '/about',
  '/how-it-works',
  '/safety',
  '/changelog',
  '/contact',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
])

// Route prefixes that are always public
const PUBLIC_PREFIXES = [
  '/blog',
  '/games',
  '/legal',
  '/api/auth',
  '/api/games',
  '/api/webhooks',
  '/api/contact',
  '/api/leaderboard',
  '/api/billing/plans',
]

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/matches',
  '/play',
  '/chat',
  '/leaderboard',
  '/profile',
  '/settings',
  '/onboarding',
  '/api/matches',
  '/api/game-sessions',
  '/api/chat',
  '/api/preferences',
  '/api/reveals',
  '/api/reports',
  '/api/notifications',
  '/api/billing/checkout',
  '/api/billing/portal',
  '/api/billing/subscription',
  '/api/leaderboard/me',
  '/api/achievements',
  '/api/profiles/me',
  '/api/onboarding',
]

// Admin-only route prefixes
const ADMIN_PREFIXES = [
  '/api/admin',
  '/admin',
]

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // static files like .css, .js, .png, etc.
  ) {
    return NextResponse.next()
  }

  // Refresh the Supabase auth session on every request
  const { supabaseResponse, user, supabase } = await updateSession(request)

  // Public routes — allow access, session is still refreshed
  if (isPublicRoute(pathname) && !isProtectedRoute(pathname)) {
    // If user is logged in and visits auth pages, redirect to dashboard
    if (user && ['/login', '/signup', '/forgot-password'].includes(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Protected routes — require authentication
  if (isProtectedRoute(pathname) || isAdminRoute(pathname)) {
    if (!user) {
      if (isApiRoute(pathname)) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        )
      }
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Check if user is suspended or banned
    const { data: profile } = await supabase
      .from('profiles')
      .select('status, role')
      .eq('id', user.id)
      .single()

    if (profile?.status === 'suspended' || profile?.status === 'banned') {
      if (isApiRoute(pathname)) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: `Your account has been ${profile.status}. Please contact support.`,
          },
          { status: 403 }
        )
      }
      // Allow access to appeal pages and settings for suspended users
      if (
        !pathname.startsWith('/settings') &&
        !pathname.startsWith('/api/billing')
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/suspended'
        return NextResponse.redirect(url)
      }
    }

    // Admin route protection
    if (isAdminRoute(pathname)) {
      if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
        if (isApiRoute(pathname)) {
          return NextResponse.json(
            { error: 'Forbidden', message: 'Insufficient permissions' },
            { status: 403 }
          )
        }
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // Some admin routes are admin-only (not moderator)
      const adminOnlyPrefixes = ['/api/admin/analytics', '/admin/analytics']
      const isAdminOnly = adminOnlyPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      )
      if (isAdminOnly && profile.role !== 'admin') {
        if (isApiRoute(pathname)) {
          return NextResponse.json(
            { error: 'Forbidden', message: 'Admin access required' },
            { status: 403 }
          )
        }
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
