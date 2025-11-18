import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import BookingButton from '@/components/BookingButton'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function EventDetailPage({
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
      bookings: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  })

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h2>
          <Link href="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const seatsBooked = event.bookings.length
  const seatsRemaining = event.maxSeats - seatsBooked
  const userBooking = event.bookings.find(
    (b) => b.userId === session.user.id
  )

  // Get mock avatars for attendees (first 5)
  const attendees = event.bookings.slice(0, 5).map((booking) => ({
    name: booking.user.profile?.name || 'Guest',
    id: booking.userId,
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Date & Time
              </h3>
              <p className="text-lg text-gray-900">{formatDate(event.dateTime)}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Location
              </h3>
              <p className="text-lg text-gray-900">{event.locationName}</p>
              <p className="text-sm text-gray-600">{event.locationAddress}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Availability
              </h3>
              <p className="text-lg text-gray-900">
                {seatsRemaining} of {event.maxSeats} seats available
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Price
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(event.price)}
              </p>
            </div>
          </div>

          {attendees.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Who&apos;s Going ({seatsBooked} people)
              </h3>
              <div className="flex flex-wrap gap-2">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {attendee.name}
                    </span>
                  </div>
                ))}
                {seatsBooked > 5 && (
                  <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">
                      +{seatsBooked - 5} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <BookingButton
            eventId={event.id}
            seatsRemaining={seatsRemaining}
            hasBooking={!!userBooking}
          />
        </div>
      </Card>
    </div>
  )
}

