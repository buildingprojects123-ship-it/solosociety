'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface ConnectionRequestCardProps {
  request: {
    id: string
    sender: {
      id: string
      profile: {
        name: string
        city: string | null
      } | null
    }
    createdAt: Date
  }
}

export default function ConnectionRequestCard({ request }: ConnectionRequestCardProps) {
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState<'accept' | 'decline' | null>(null)

  const senderName = request.sender.profile?.name || 'New member'
  const senderCity = request.sender.profile?.city || 'Your city'
  const requestDate = new Date(request.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  })

  const handleAction = async (action: 'accept' | 'decline') => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId: request.id, action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update connection')
      }
      router.refresh()
    } catch (error) {
      console.error('Connection action error:', error)
      alert('Unable to update request. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <span className="text-primary-700 text-lg font-semibold">
          {senderName.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{senderName}</p>
        <p className="text-xs text-gray-500">
          {senderCity} • {requestDate}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          wants to connect with you
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        <Button
          size="sm"
          variant="secondary"
          disabled={actionLoading === 'decline'}
          loading={actionLoading === 'decline'}
          onClick={() => handleAction('decline')}
        >
          Decline
        </Button>
        <Button
          size="sm"
          disabled={actionLoading === 'accept'}
          loading={actionLoading === 'accept'}
          onClick={() => handleAction('accept')}
        >
          Accept
        </Button>
      </div>
    </div>
  )
}

