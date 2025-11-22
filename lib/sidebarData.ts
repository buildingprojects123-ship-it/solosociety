import { prisma } from './prisma'

export interface SidebarSuggestedUser {
  id: string
  name: string
  city: string | null
  connections: number
}

export interface SidebarWeekendEvent {
  id: string
  title: string
  dateTimeISO: string
  dateLabel: string
  venue: string
  priceLabel: string
  imageUrl: string
  attendeeCount: number
}

export interface SidebarFavoritePlace {
  id: string
  name: string
  city: string | null
  friends: number
  friendNames: string[]
  href: string
  snippet: string
  tags: string[]
  imageUrl: string
}

export interface SidebarData {
  suggestedUsers: SidebarSuggestedUser[]
  weekendEvents: SidebarWeekendEvent[]
  favoritePlaces: SidebarFavoritePlace[]
}

const PLACEHOLDER_EVENT_IMAGE = 'https://placehold.co/400x300/dbeafe/3b82f6?text=Event'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getSidebarData(currentUserId?: string): Promise<SidebarData> {
  const [suggestedUsers, weekendEvents, favoritePlaces] = await Promise.all([
    getSuggestedUsers(currentUserId),
    getWeekendEvents(),
    getFavoritePlaces(),
  ])

  return {
    suggestedUsers,
    weekendEvents,
    favoritePlaces,
  }
}

async function getSuggestedUsers(currentUserId?: string): Promise<SidebarSuggestedUser[]> {
  const profiles = await prisma.profile.findMany({
    where: currentUserId
      ? {
        userId: {
          not: currentUserId,
        },
      }
      : undefined,
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  if (profiles.length === 0) {
    return []
  }

  const profileUserIds = profiles.map((profile) => profile.userId)

  const connections = await prisma.connection.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [
        { senderId: { in: profileUserIds } },
        { receiverId: { in: profileUserIds } },
      ],
    },
  })

  const connectionCounts: Record<string, number> = Object.fromEntries(
    profileUserIds.map((id) => [id, 0])
  )

  connections.forEach((connection) => {
    if (connectionCounts[connection.senderId] !== undefined) {
      connectionCounts[connection.senderId] += 1
    }
    if (connectionCounts[connection.receiverId] !== undefined) {
      connectionCounts[connection.receiverId] += 1
    }
  })

  return profiles.map((profile) => ({
    id: profile.userId,
    name: profile.name,
    city: profile.city,
    connections: connectionCounts[profile.userId] ?? 0,
  }))
}

async function getWeekendEvents(): Promise<SidebarWeekendEvent[]> {
  const now = new Date()
  const windowEnd = new Date(now)
  windowEnd.setDate(windowEnd.getDate() + 7)

  let events = await prisma.event.findMany({
    where: {
      status: 'UPCOMING',
      dateTime: {
        gte: now,
        lte: windowEnd,
      },
    },
    orderBy: {
      dateTime: 'asc',
    },
    include: {
      bookings: true,
    },
    take: 5,
  })

  if (events.length === 0) {
    events = await prisma.event.findMany({
      where: {
        status: 'UPCOMING',
        dateTime: {
          gte: now,
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
      include: {
        bookings: true,
      },
      take: 5,
    })
  }

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    dateTimeISO: event.dateTime.toISOString(),
    dateLabel: event.dateTime.toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    venue: event.locationName,
    priceLabel: event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`,
    imageUrl: event.imageUrl || PLACEHOLDER_EVENT_IMAGE,
    attendeeCount: event.bookings.length,
  }))
}

async function getFavoritePlaces(): Promise<SidebarFavoritePlace[]> {
  const places = await prisma.place.findMany({
    take: 4,
    orderBy: {
      rating: 'desc',
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  return places.map((place) => ({
    id: place.id,
    name: place.name,
    city: place.city,
    friends: place._count.posts, // Using posts count as proxy
    friendNames: [], // TODO: Fetch actual friend names if needed
    href: '/places',
    snippet: `${place.rating} ★ • ${place.neighborhood || place.city}`,
    tags: JSON.parse(place.vibeTags) as string[],
    imageUrl: place.imageUrl,
  }))
}

