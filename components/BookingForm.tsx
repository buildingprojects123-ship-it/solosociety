'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { bookEvent } from '@/app/actions'

export default function BookingForm({
  eventId,
  price,
}: {
  eventId: string
  price: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await bookEvent(eventId)
      const conversationParam = result?.conversationId ? `?conversationId=${result.conversationId}` : ''
      router.push(`/events/${eventId}/success${conversationParam}`)
    } catch (error) {
      console.error('Booking error:', error)
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl shadow-lg shadow-black/20 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Booking Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-muted-foreground">
          <span>Price per seat</span>
          <span>₹{price}</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-foreground">
          <span>Total</span>
          <span>₹{price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-200">
            <strong>Note:</strong> This is a prototype. No actual payment will
            be processed. Click &quot;Confirm Booking&quot; to proceed.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}

