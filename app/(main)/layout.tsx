import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileGuard from '@/components/ProfileGuard'
import MainLayoutClient from '@/components/layout/MainLayout'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check if profile exists
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <MainLayoutClient>
      <ProfileGuard hasProfile={!!profile}>{children}</ProfileGuard>
    </MainLayoutClient>
  )
}

