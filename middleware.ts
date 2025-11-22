import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow access to login page
    if (req.nextUrl.pathname === '/login') {
      return NextResponse.next()
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without auth
        if (req.nextUrl.pathname === '/login') {
          return true
        }
        return !!token
      },
    },
    secret: process.env.NEXTAUTH_SECRET || 'p4YglFkHVWrV6rZpZUo68vlHaHRuBsnPP9qxbjQfu/0=',
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

