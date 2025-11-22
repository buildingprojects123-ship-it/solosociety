import PlaceCard from '@/components/places/PlaceCard'
import EmptyState from '@/components/ui/EmptyState'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function PlacesPage() {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  const places = await prisma.place.findMany({
    include: {
      reviews: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      posts: {
        where: {
          userId: {
            in: currentUserId
              ? (
                await prisma.connection.findMany({
                  where: {
                    status: 'ACCEPTED',
                    OR: [
                      { senderId: currentUserId },
                      { receiverId: currentUserId },
                    ],
                  },
                })
              ).flatMap((c) =>
                c.senderId === currentUserId ? [c.receiverId] : [c.senderId]
              )
              : [],
          },
        },
        select: {
          userId: true,
        },
      },
    },
  })

  const transformedPlaces = places.map((place) => ({
    id: place.id,
    name: place.name,
    neighborhood: place.neighborhood || '',
    city: place.city,
    imageUrl: place.imageUrl,
    vibeTags: JSON.parse(place.vibeTags) as string[],
    friendsCount: place.posts.length, // Using posts count as proxy for "friends checked in" for now
    rating: place.rating,
    reviews: place.reviews.map((review) => ({
      friend: review.user.profile?.name || 'Someone',
      review: review.content,
    })),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Places</h1>
        <p className="text-muted-foreground">Discover spots your friends love</p>
      </div>

      {/* Places Grid */}
      {transformedPlaces.length === 0 ? (
        <EmptyState
          title="No places yet"
          description="Check back soon for new places!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transformedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}

