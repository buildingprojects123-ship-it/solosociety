import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import UserProfileView from '@/components/profile/UserProfileView'

export default async function UserProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // If viewing own profile, redirect to /profile
  if (params.userId === session.user.id) {
    redirect('/profile')
  }

  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      profile: true,
      posts: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          likes: true,
          comments: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
            take: 3,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      bookings: {
        include: {
          event: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!user || !user.profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600">This user doesn't exist or hasn't set up their profile.</p>
        </div>
      </div>
    )
  }

  // Check connection status
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: params.userId },
        { senderId: params.userId, receiverId: session.user.id },
      ],
    },
  })

  return (
    <UserProfileView
      user={user}
      currentUserId={session.user.id}
      connection={connection}
    />
  )
}

