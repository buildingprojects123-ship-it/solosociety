import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import FeedContent from '@/components/feed/FeedContent'
import { getSidebarData } from '@/lib/sidebarData'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  // TODO: Fetch posts with proper typing for different post types
  // For now, we'll fetch regular posts and transform them
  // Fetch posts and sidebar data in parallel
  const [posts, sidebarData] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: 10,
        },
        place: true,
      },
      take: 20,
    }),
    getSidebarData(session.user.id)
  ])

  return (
    <FeedContent
      posts={posts}
      currentUserId={session.user.id}
      highlightEvents={sidebarData.weekendEvents}
      highlightPlaces={sidebarData.favoritePlaces}
    />
  )
}
