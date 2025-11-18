import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import BookingForm from '@/components/BookingForm'

export default async function BookEventPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      bookings: true,
    },
  })

  if (!event) {
    redirect('/events')
  }

  const seatsBooked = event.bookings.length
  const seatsRemaining = event.maxSeats - seatsBooked

  // Check if user already has a booking
  const existingBooking = await prisma.booking.findUnique({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId: event.id,
      },
    },
  })

  if (existingBooking) {
    redirect(`/events/${event.id}`)
  }

  if (seatsRemaining <= 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event Sold Out
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, all seats for this event have been booked.
          </p>
          <a
            href="/events"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Other Events
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Booking</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              📅{' '}
              {new Date(event.dateTime).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>📍 {event.locationName}</p>
          </div>
        </div>
      </div>

      <BookingForm eventId={event.id} price={event.price} />
    </div>
  )
}

