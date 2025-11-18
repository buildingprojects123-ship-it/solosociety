'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function BookingButton({
  eventId,
  seatsRemaining,
  hasBooking,
}: {
  eventId: string
  seatsRemaining: number
  hasBooking: boolean
}) {
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your booking?')) return

    setIsCanceling(true)
    try {
      const response = await fetch(`/api/bookings?eventId=${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error canceling booking:', error)
      alert('Something went wrong')
    } finally {
      setIsCanceling(false)
    }
  }

  if (hasBooking) {
    return (
      <div className="mt-6 space-y-3">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success">✓ Booked</Badge>
            <p className="text-green-800 font-medium">
              You&apos;re going to this event!
            </p>
          </div>
        </div>
        <Button
          onClick={handleCancel}
          variant="secondary"
          className="w-full"
          loading={isCanceling}
        >
          Cancel Booking
        </Button>
      </div>
    )
  }

  if (seatsRemaining <= 0) {
    return (
      <Button disabled className="w-full" size="lg">
        Sold Out
      </Button>
    )
  }

  return (
    <Button
      onClick={() => router.push(`/events/${eventId}/book`)}
      className="w-full"
      size="lg"
    >
      Book a Seat
    </Button>
  )
}

