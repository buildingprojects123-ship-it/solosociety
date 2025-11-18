import Link from 'next/link'

export default function BookingSuccessPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600">
            Your seat has been reserved. We&apos;ll see you at the dinner!
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={`/events/${params.id}`}
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Event Details
          </Link>
          <Link
            href="/events"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  )
}

