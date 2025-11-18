import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      phone: string
    }
  }

  interface User {
    id: string
    phone: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string
    phone: string
  }
}

