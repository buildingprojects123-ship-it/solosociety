'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// REMOVE this line:
// import WhereAtFocus from '@/components/ui/WhereAtFocus'
import SoloSocietyFocus from '@/components/ui/SoloSocietyFocus'

// TODO: Replace with real user data from API
const cities = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad']
const currentCity = 'Mumbai' // TODO: Get from user profile or context

export default function TopNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // TODO: Get user profile data from API
  // Use consistent fallback to avoid hydration mismatch
  // Defensive fallback for user initial
  const userInitial =
    mounted && typeof session?.user?.phone === 'string' && session.user.phone.length > 0
      ? session.user.phone.charAt(0).toUpperCase()
      : 'U';

  const mockNotifications = [
    { id: 1, title: 'New Follower', message: 'Sarah started following you', time: '2m ago', read: false },
    { id: 2, title: 'Event Reminder', message: 'Dinner at Olive starts in 1h', time: '1h ago', read: false },
    { id: 3, title: 'New Like', message: 'Alex liked your post', time: '3h ago', read: true },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Hidden on desktop (shown in sidebar), visible on mobile */}
          <Link href="/feed" className="lg:hidden">
            <SoloSocietyFocus
              sentence="Solo Society"
              manualMode={false}
              blurAmount={4}
              borderColor="#3b82f6"
              animationDuration={0.6}
              pauseBetweenAnimations={1.2}
              textSize="text-xl"
            />
          </Link>

          {/* City Selector */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-foreground">{currentCity}</span>
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showCityDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCityDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-white/10 rounded-lg shadow-xl py-1 z-20">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setShowCityDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-white/5"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                }
              }}
              className="relative group"
            >
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search events, places, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-transparent focus:border-primary/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors relative group"
              >
                <svg
                  className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-white/10 rounded-lg shadow-xl py-2 z-20">
                    <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button className="text-xs text-primary hover:text-primary/80">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className={`px-4 py-3 hover:bg-white/5 cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{notif.title}</span>
                            <span className="text-xs text-muted-foreground">{notif.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <Link
              href="/messages"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <svg
                className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white text-sm font-medium">
                    {mounted ? userInitial : ''}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-white/10 rounded-lg shadow-xl py-1 z-20">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-white/5"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-white/5"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={async () => {
                        setShowUserMenu(false)
                        await signOut({ redirect: true, callbackUrl: '/login' })
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

