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
  const [incomingRequests, setIncomingRequests] = useState<Array<{
    id: string
    senderId: string
    sender: {
      id: string
      profile: {
        name: string
        city: string
      } | null
    }
  }>>([])

  const fetchConnectionStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/connections/status')
      if (!response.ok) return
      const data = await response.json()
      const outgoingMap: Record<string, string> = {}
      const incomingMap: Record<string, string> = {}
      const pendingRequests: typeof incomingRequests = []

        ; (data.outgoing || []).forEach((entry: any) => {
          outgoingMap[entry.receiverId] = entry.status
        })

        ; (data.incoming || []).forEach((entry: any) => {
          incomingMap[entry.senderId] = entry.status
          if (entry.status === 'PENDING') {
            pendingRequests.push(entry)
          }
        })

      setConnectionStatus({ outgoing: outgoingMap, incoming: incomingMap })
      setIncomingRequests(pendingRequests)
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

  const handleResponse = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      })

      if (response.ok) {
        fetchConnectionStatus()
      }
    } catch (error) {
      console.error('Error responding to request:', error)
    }
  }

  const Container = variant === 'desktop' ? 'aside' : 'section'

  const containerClasses =
    variant === 'desktop'
      ? 'hidden xl:flex flex-col w-80 space-y-6' // Removed sticky/fixed here as it's handled by parent layout now
      : 'space-y-6'

  if (isLoading) {
    return (
      <Container className={containerClasses}>
        {[1, 2, 3].map((panel) => (
          <div key={panel} className="bg-card/30 backdrop-blur-xl rounded-xl border border-white/5 p-4 shadow-sm animate-pulse">
            <div className="h-4 w-32 bg-white/10 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
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
          <p className="text-xs text-muted-foreground">Refresh the page or try again in a minute.</p>
        </SidebarPanel>
      </Container>
    )
  }

  return (
    <Container className={containerClasses}>
      {/* Connection Requests Panel */}
      {incomingRequests.length > 0 && (
        <SidebarPanel title="Connection Requests" actionLabel={`${incomingRequests.length} pending`}>
          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-2">
                <Link href={`/profile/${req.senderId}`} className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">
                      {req.sender.profile?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {req.sender.profile?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {req.sender.profile?.city || 'Unknown city'}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleResponse(req.id, 'accept')}
                    className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-md transition-colors"
                    title="Accept"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleResponse(req.id, 'decline')}
                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Decline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SidebarPanel>
      )}

      <SidebarPanel title="This weekend's picks">
        {sidebarData.weekendEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground">No events this week. Check back soon!</p>
        ) : (
          <div className="space-y-3">
            {sidebarData.weekendEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.dateLabel}</p>
                    <p className="text-xs text-muted-foreground">{event.venue}</p>
                    <p className="text-xs font-medium text-primary mt-1">
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
          <p className="text-xs text-muted-foreground">Share a check-in to start this list.</p>
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
                    <p className="text-sm font-medium text-foreground group-hover:text-primary">
                      {place.name}
                    </p>
                    {place.city && (
                      <p className="text-xs text-muted-foreground">{place.city}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{place.snippet}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {place.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full"
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
                        className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background"
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SidebarPanel>

      <SidebarPanel title="Suggested for you" actionLabel="More coming soon">
        {sidebarData.suggestedUsers.length === 0 ? (
          <p className="text-xs text-muted-foreground">We&apos;ll surface members as soon as they join.</p>
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
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.connections} connection{user.connections === 1 ? '' : 's'}
                      </p>
                    </div>
                  </Link>
                  {isConnected ? (
                    <span className="text-xs font-semibold text-primary">
                      Connected
                    </span>
                  ) : incomingStatus === 'PENDING' ? (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  ) : (
                    <button
                      onClick={() => handleConnect(user.id)}
                      disabled={isRequestSent}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isRequestSent
                        ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                        : 'text-primary hover:bg-primary/10'
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
    <div className="bg-card/30 backdrop-blur-xl rounded-xl border border-white/5 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {actionHref ? (
          <Link
            href={actionHref}
            className="text-sm text-primary hover:text-primary"
          >
            {actionLabel}
          </Link>
        ) : actionLabel ? (
          <span className="text-xs font-medium text-muted-foreground">{actionLabel}</span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

