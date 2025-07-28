import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sid = request.cookies.get('sid')?.value
  const isLoggedIn = !!sid

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/tickets', request.url))
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Does not run on: form, public assets
export const config = {
  matcher: ['/((?!^$|_next/|favicon.ico).*)'],
}
