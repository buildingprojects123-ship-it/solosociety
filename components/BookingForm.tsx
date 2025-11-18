'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })

      if (response.ok) {
        router.push(`/events/${eventId}/success`)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to book seat')
        setLoading(false)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Price per seat</span>
          <span>₹{price}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>₹{price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a prototype. No actual payment will
            be processed. Click &quot;Confirm Booking&quot; to proceed.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}

