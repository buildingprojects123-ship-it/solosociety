import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { MOCK_OTP } from './constants'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'p4YglFkHVWrV6rZpZUo68vlHaHRuBsnPP9qxbjQfu/0=',
  debug: false,
  providers: [
    CredentialsProvider({
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        console.log('Authorize called with:', { phone: credentials?.phone, otp: credentials?.otp })

        if (!credentials?.phone || !credentials?.otp) {
          console.log('Missing credentials')
          return null
        }

        const phone = credentials.phone.trim()
        const otp = credentials.otp.trim()

        // Mock OTP validation
        if (otp !== MOCK_OTP) {
          console.log(`Invalid OTP provided: ${otp}. Expected: ${MOCK_OTP}`)
          return null
        }

        try {
          // Find or create user
          let user = await prisma.user.findUnique({
            where: { phone },
          })

          if (!user) {
            console.log('Creating new user for phone:', phone)
            user = await prisma.user.create({
              data: { phone },
            })
          } else {
            console.log('Found existing user:', user.id)
          }

          return {
            id: user.id,
            phone: user.phone,
          }
        } catch (error) {
          console.error('Database error in authorize:', error)
          // If create failed because of race condition (unique constraint), try finding again
          if ((error as any).code === 'P2002') {
            try {
              const user = await prisma.user.findUnique({
                where: { phone },
              })
              if (user) return { id: user.id, phone: user.phone }
            } catch (retryError) {
              console.error('Retry find failed:', retryError)
            }
          }
          return null
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // ...other providers
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user = {
          id: token.sub,
          phone: token.phone as string,
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.phone = user.phone
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
