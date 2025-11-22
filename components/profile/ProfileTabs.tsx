'use client'

import { useState, useEffect } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import PostCard from '@/components/feed/PostCard'
import EventCard from '@/components/events/EventCard'

type TabType = 'posts' | 'events' | 'dinners' | 'places'

interface ProfileTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  userId?: string
}

export default function ProfileTabs({ activeTab, onTabChange, userId }: ProfileTabsProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId, activeTab])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Get current user ID
      const profileRes = await fetch('/api/profile')
      const profile = profileRes.ok ? await profileRes.json() : null
      const currentUserId = userId || profile?.userId

      if (!currentUserId) {
        setLoading(false)
        return
      }

      // Fetch posts
      const postsRes = await fetch('/api/posts')
      if (postsRes.ok) {
        const data = await postsRes.json()
        const allPosts = data.posts || []
        const userPosts = allPosts.filter((p: any) => p.user.id === currentUserId)
        setPosts(userPosts || [])
      }

      // Fetch bookings/events
      const bookingsRes = await fetch('/api/bookings')
      if (bookingsRes.ok) {
        const data = await bookingsRes.json()
        const eventCards = (data.bookings || []).map((booking: any) => ({
          id: booking.event.id,
          title: booking.event.title,
          dateTime: new Date(booking.event.dateTime).toLocaleString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
          locationName: booking.event.locationName,
          imageUrl: booking.event.imageUrl,
          maxSeats: booking.event.maxSeats,
          bookedSeats: 0,
          price: booking.event.price,
          status: booking.event.status,
        }))
        setEvents(eventCards || [])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'posts', label: 'Posts' },
    { id: 'events', label: 'Events' },
    { id: 'dinners', label: 'Dinners' },
    { id: 'places', label: 'Places' },
  ]

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'posts':
        if (posts.length === 0) {
          return (
            <EmptyState
              title="No posts yet"
              description="Start sharing your experiences!"
            />
          )
        }
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )

      case 'events':
        if (events.length === 0) {
          return (
            <EmptyState
              title="No events yet"
              description="Events you've attended will appear here"
            />
          )
        }
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )

      case 'dinners':
        const dinners = events.filter((e) =>
          e.title.toLowerCase().includes('dinner')
        )
        if (dinners.length === 0) {
          return (
            <EmptyState
              title="No dinners yet"
              description="Dinners you've attended will appear here"
            />
          )
        }
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dinners.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )

      case 'places':
        return (
          <EmptyState
            title="No places yet"
            description="Places you've checked into will appear here"
          />
        )
    }
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg shadow-black/20">
      {/* Tab Buttons */}
      <div className="border-b border-white/5">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-secondary/10">{renderTabContent()}</div>
    </div>
  )
}

