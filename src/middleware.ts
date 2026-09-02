import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected route prefixes
const PROTECTED_ROUTES = [
  '/admin',
  '/provider',
  '/dashboard',
  '/messages',
  '/bookings',
  '/profile',
  '/favorites',
  '/notifications',
]

// Auth routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('session-token')?.value

  // Check if current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if current path is auth route
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname))
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/provider/:path*',
    '/dashboard/:path*',
    '/messages/:path*',
    '/bookings/:path*',
    '/profile/:path*',
    '/favorites/:path*',
    '/notifications/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
}
