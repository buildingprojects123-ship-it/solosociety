'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostCard from '@/components/feed/PostCard'
import EventCard from '@/components/events/EventCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { createDirectConversation } from '@/app/actions/chat'

type TabType = 'posts' | 'events' | 'dinners' | 'places'

interface UserProfileViewProps {
  user: {
    id: string
    profile: {
      name: string
      age: number | null
      city: string
      interests: string
    } | null
    posts: any[]
    bookings: Array<{
      event: {
        id: string
        title: string
        dateTime: Date
        locationName: string
        imageUrl: string
        maxSeats: number
        price: number
        status: string
      }
    }>
  }
  currentUserId: string
  connection: {
    id: string
    status: string
    senderId: string
  } | null
}

export default function UserProfileView({
  user,
  currentUserId,
  connection,
}: UserProfileViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMessaging, setIsMessaging] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(connection?.status || null)

  const interests = user.profile?.interests
    ? JSON.parse(user.profile.interests)
    : []

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        setConnectionStatus('PENDING')
      } else {
        alert('Failed to send connection request')
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Something went wrong')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleMessage = async () => {
    setIsMessaging(true)
    try {
      const conversationId = await createDirectConversation(user.id)
      router.push(`/messages?id=${conversationId}`)
    } catch (error) {
      console.error('Failed to start conversation:', error)
      alert('Failed to start conversation')
    } finally {
      setIsMessaging(false)
    }
  }

  const userInitial = user.profile?.name.charAt(0).toUpperCase() || 'U'

  // Transform bookings to event cards format
  const events = user.bookings.map((booking) => ({
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        if (user.posts.length === 0) {
          return (
            <EmptyState
              title="No posts yet"
              description="This user hasn't shared any posts yet"
            />
          )
        }
        return (
          <div className="space-y-6">
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))}
          </div>
        )

      case 'events':
        if (events.length === 0) {
          return (
            <EmptyState
              title="No events yet"
              description="This user hasn't attended any events yet"
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
              description="This user hasn't attended any dinners yet"
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
            description="Places feature coming soon"
          />
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-bold">{userInitial}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.profile?.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {user.profile?.age && <span>Age: {user.profile.age}</span>}
                <span>📍 {user.profile?.city}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleMessage}
              loading={isMessaging}
            >
              Message
            </Button>
            {connectionStatus === 'ACCEPTED' ? (
              <Badge variant="primary">Connected</Badge>
            ) : connectionStatus === 'PENDING' ? (
              <Badge variant="warning">Request Sent</Badge>
            ) : (
              <Button onClick={handleConnect} loading={isConnecting}>
                Connect
              </Button>
            )}
          </div>
        </div>

        {interests.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest: string) => (
                <Badge key={interest} variant="primary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'posts' as TabType, label: 'Posts', count: user.posts.length },
              { id: 'events' as TabType, label: 'Events', count: events.length },
              { id: 'dinners' as TabType, label: 'Dinners', count: events.filter((e) => e.title.toLowerCase().includes('dinner')).length },
              { id: 'places' as TabType, label: 'Places', count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  )
}

