'use client'

import { useState } from 'react'
import StoryRow from './StoryRow'
import PostCard from './PostCard'
import type { SidebarFavoritePlace, SidebarWeekendEvent } from '@/lib/sidebarData'
import EmptyState from '@/components/ui/EmptyState'

// TODO: Replace with proper types from API
interface Post {
  id: string
  content: string | null
  imageUrl: string | null
  location: string | null
  createdAt: Date
  user: {
    id: string
    profile: {
      name: string
      city: string
    } | null
  }
  likes: Array<{ userId: string }>
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    user: {
      profile: {
        name: string
      } | null
    }
  }>
}

interface FeedContentProps {
  posts: Post[]
  currentUserId?: string
  highlightEvents?: SidebarWeekendEvent[]
  highlightPlaces?: SidebarFavoritePlace[]
}

export default function FeedContent({
  posts,
  currentUserId,
  highlightEvents = [],
  highlightPlaces = [],
}: FeedContentProps) {
  const [showStories] = useState(true)

  const highlightAuthor = {
    id: 'whereat-highlight',
    profile: {
      name: 'WhereAt Team',
      city: 'Mumbai',
    },
  }

  // Transform regular posts to new format
  const transformedPosts = posts.map((post) => ({
    id: post.id,
    type: 'regular' as const,
    content: post.content || '',
    imageUrl: post.imageUrl,
    location: post.location,
    createdAt: post.createdAt,
    user: post.user,
    likes: post.likes,
    comments: post.comments,
  }))

  const eventHighlights = highlightEvents.map((event) => ({
    id: `event-${event.id}`,
    type: 'event' as const,
    eventId: event.id,
    title: event.title,
    dateTime: event.dateLabel,
    venue: event.venue,
    imageUrl: event.imageUrl,
    mutualsGoing: event.attendeeCount,
    price: event.priceLabel,
    createdAt: new Date(event.dateTimeISO),
    user: highlightAuthor,
    likes: [],
    comments: [],
  }))

  const placeHighlights = highlightPlaces.map((place) => ({
    id: `place-${place.id}`,
    type: 'place' as const,
    placeId: place.id,
    placeName: place.name,
    city: place.city ?? 'Your city',
    imageUrl: place.imageUrl,
    vibeTags: place.tags,
    friendsWhoWent:
      place.friendNames.length > 0
        ? place.friendNames.map((name, index) => ({
            id: `${place.id}-${index}`,
            name,
          }))
        : [{ id: `${place.id}-placeholder`, name: 'Friend' }],
    review: place.snippet,
    createdAt: new Date(),
    user: highlightAuthor,
    likes: [],
    comments: [],
  }))

  const allPosts = [...eventHighlights, ...placeHighlights, ...transformedPosts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stories Row */}
      {showStories && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <StoryRow />
        </div>
      )}

      {/* Posts Feed */}
      {allPosts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Start following people or create your first post!"
        />
      ) : (
        <div className="space-y-6">
          {allPosts.map((post) => (
            <PostCard key={post.id} post={post as any} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  )
}

