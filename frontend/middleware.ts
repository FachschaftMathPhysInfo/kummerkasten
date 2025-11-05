import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {LoginCheckDocument, LoginCheckQuery} from "@/lib/graph/generated/graphql";
import {GraphQLClient} from "graphql-request";

const PUBLIC_ROUTES = ['/', '/login']

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl

  async function checkIsLoggedIn() {
    const sid = request.cookies.get('sid')?.value;
    if(!sid) {
      console.log('[middleware] no sid cookie found')
      return false;
    } else {
      console.log('[middleware] sid found: ', sid);
    }
    
    try {
      const apiUrl = 'http://localhost:8080/api'
      const client = new GraphQLClient(apiUrl.toString())
      const loggedInData = await client.request<LoginCheckQuery>(LoginCheckDocument, { sid })
      console.log('[middleware] login check answer: ')
      console.log(loggedInData.loginCheck)
      return loggedInData.loginCheck !== null
    } catch (err) {
      console.error('[middleware] login check threw error: ', err)
      return false
    }
  }

  const isLoggedIn = await checkIsLoggedIn()
  console.log('User login status: ', isLoggedIn)

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/tickets', request.url))
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('sid')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/tickets/:path*',
    '/users',
    '/labels',
    '/profile',
    '/account',
    '/faq',
    '/app-settings'
  ],
}

