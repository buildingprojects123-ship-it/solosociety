'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SuggestedUsersProps {
  users: Array<{
    id: string
    profile: {
      name: string
      city: string
    } | null
  }>
  currentUserId: string
}

export default function SuggestedUsers({
  users,
  currentUserId,
}: SuggestedUsersProps) {
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

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
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  if (users.length === 0) return null

  return (
    <div className="sticky top-8">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Suggested for you</h3>
          <Link
            href="/feed/explore"
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            See all
          </Link>
        </div>

        <div className="space-y-4">
          {users.slice(0, 5).map((user) => {
            if (!user.profile) return null
            const isRequestSent = sentRequests.has(user.id)

            return (
              <div key={user.id} className="flex items-center justify-between">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">
                      {user.profile.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.profile.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.profile.city}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => handleConnect(user.id)}
                  disabled={isRequestSent}
                  className={`text-xs font-medium px-3 py-1.5 rounded ${
                    isRequestSent
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-primary-600 hover:text-primary-700'
                  }`}
                >
                  {isRequestSent ? 'Sent' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

