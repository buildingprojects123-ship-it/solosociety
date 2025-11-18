'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { SidebarData } from '@/lib/sidebarData'

type Variant = 'desktop' | 'inline'

interface RightSidebarProps {
  variant?: Variant
}

const DEFAULT_DATA: SidebarData = {
  suggestedUsers: [],
  weekendEvents: [],
  favoritePlaces: [],
}

export default function RightSidebar({ variant = 'desktop' }: RightSidebarProps) {
  const router = useRouter()
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())
  const [sidebarData, setSidebarData] = useState<SidebarData>(DEFAULT_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<{
    outgoing: Record<string, string>
    incoming: Record<string, string>
  }>({
    outgoing: {},
    incoming: {},
  })

  const fetchConnectionStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/connections/status')
      if (!response.ok) return
      const data = await response.json()
      const outgoingMap: Record<string, string> = {}
      const incomingMap: Record<string, string> = {}

      ;(data.outgoing || []).forEach((entry: any) => {
        outgoingMap[entry.receiverId] = entry.status
      })

      ;(data.incoming || []).forEach((entry: any) => {
        incomingMap[entry.senderId] = entry.status
      })

      setConnectionStatus({ outgoing: outgoingMap, incoming: incomingMap })
    } catch (err) {
      console.error('Failed to fetch connection status', err)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const fetchSidebar = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/feed/sidebar')
        if (!response.ok) {
          throw new Error('Failed to load sidebar data')
        }
        const data = (await response.json()) as SidebarData
        if (isMounted) {
          setSidebarData(data)
        }
      } catch (err) {
        console.error('Error fetching sidebar data:', err)
        if (isMounted) {
          setError('Unable to load recommendations right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSidebar()
    fetchConnectionStatus()
    return () => {
      isMounted = false
    }
  }, [fetchConnectionStatus])

  const handleConnect = async (userId: string) => {
    if (sentRequests.has(userId)) return

    try {
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        setSentRequests((prev) => new Set(prev).add(userId))
        fetchConnectionStatus()
      } else {
        alert('Failed to send connection request')
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Something went wrong')
    }
  }

  const Container = variant === 'desktop' ? 'aside' : 'section'

  const containerClasses =
    variant === 'desktop'
      ? 'hidden xl:flex flex-col w-80 space-y-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2'
      : 'space-y-6'

  if (isLoading) {
    return (
      <Container className={containerClasses}>
        {[1, 2, 3].map((panel) => (
          <div key={panel} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Container>
    )
  }

  if (error) {
    return (
      <Container className={containerClasses}>
        <SidebarPanel title="We tried…" actionLabel={error}>
          <p className="text-xs text-gray-500">Refresh the page or try again in a minute.</p>
        </SidebarPanel>
      </Container>
    )
  }

  return (
    <Container className={containerClasses}>
      <SidebarPanel title="Suggested for you" actionLabel="More coming soon">
        {sidebarData.suggestedUsers.length === 0 ? (
          <p className="text-xs text-gray-500">We&apos;ll surface members as soon as they join.</p>
        ) : (
          <div className="space-y-3">
            {sidebarData.suggestedUsers.map((user) => {
              const outgoingStatus = connectionStatus.outgoing[user.id]
              const incomingStatus = connectionStatus.incoming[user.id]
              const isConnected =
                outgoingStatus === 'ACCEPTED' || incomingStatus === 'ACCEPTED'
              const isRequestSent =
                outgoingStatus === 'PENDING' ||
                sentRequests.has(user.id)

              return (
                <div key={user.id} className="flex items-center justify-between">
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.connections} connection{user.connections === 1 ? '' : 's'}
                      </p>
                    </div>
                  </Link>
                  {isConnected ? (
                    <span className="text-xs font-semibold text-primary-600">
                      Connected
                    </span>
                  ) : incomingStatus === 'PENDING' ? (
                    <button
                      type="button"
                      onClick={() => router.push('/feed/notifications')}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg text-primary-600 hover:bg-primary-50"
                    >
                      Respond
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(user.id)}
                      disabled={isRequestSent}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        isRequestSent
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {isRequestSent ? 'Sent' : 'Connect'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </SidebarPanel>

      <SidebarPanel title="This weekend's picks">
        {sidebarData.weekendEvents.length === 0 ? (
          <p className="text-xs text-gray-500">No events this week. Check back soon!</p>
        ) : (
          <div className="space-y-3">
            {sidebarData.weekendEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary-600">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{event.dateLabel}</p>
                    <p className="text-xs text-gray-500">{event.venue}</p>
                    <p className="text-xs font-medium text-primary-600 mt-1">
                      {event.priceLabel}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SidebarPanel>

      <SidebarPanel title="Friends' favourite spots">
        {sidebarData.favoritePlaces.length === 0 ? (
          <p className="text-xs text-gray-500">Share a check-in to start this list.</p>
        ) : (
          <div className="space-y-3">
            {sidebarData.favoritePlaces.map((place) => (
              <Link
                key={place.id}
                href={place.href}
                className="block group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                      {place.name}
                    </p>
                    {place.city && (
                      <p className="text-xs text-gray-500">{place.city}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{place.snippet}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {place.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[11px] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex -space-x-2 flex-shrink-0">
                    {[...Array(Math.min(place.friends, 3))].map((_, i) => (
                      <div
                        key={`${place.id}-${i}`}
                        className="w-6 h-6 rounded-full bg-primary-200 border-2 border-white"
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SidebarPanel>
    </Container>
  )
}

function SidebarPanel({
  title,
  children,
  actionLabel,
  actionHref,
}: {
  title: string
  children: React.ReactNode
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {actionHref ? (
          <Link
            href={actionHref}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {actionLabel}
          </Link>
        ) : actionLabel ? (
          <span className="text-xs font-medium text-gray-400">{actionLabel}</span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

