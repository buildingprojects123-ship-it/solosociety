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
        <Card className="p-8 text-center bg-card border-white/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">
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
      <Card className="overflow-hidden bg-card border-white/5 shadow-xl shadow-black/20">
        <div className="relative h-64 md:h-96 w-full bg-secondary/50">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Date & Time
              </h3>
              <p className="text-xl text-foreground font-medium flex items-center gap-2">
                <span className="text-primary">🗓️</span> {formatDate(event.dateTime)}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Location
              </h3>
              <div>
                <p className="text-xl text-foreground font-medium flex items-center gap-2">
                  <span className="text-primary">📍</span> {event.locationName}
                </p>
                <p className="text-sm text-muted-foreground ml-7 mt-1">{event.locationAddress}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Availability
              </h3>
              <p className="text-xl text-foreground font-medium flex items-center gap-2">
                <span className="text-primary">🎟️</span> {seatsRemaining} of {event.maxSeats} seats available
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Price
              </h3>
              <p className="text-3xl font-bold text-primary drop-shadow-sm">
                {formatCurrency(event.price)}
              </p>
            </div>
          </div>

          {attendees.length > 0 && (
            <div className="mb-10 p-6 bg-secondary/30 rounded-xl border border-white/5">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Who&apos;s Going ({seatsBooked} people)
              </h3>
              <div className="flex flex-wrap gap-3">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white text-sm font-semibold shadow-inner">
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {attendee.name}
                    </span>
                  </div>
                ))}
                {seatsBooked > 5 && (
                  <div className="flex items-center bg-secondary/50 rounded-full px-4 py-2 shadow-sm border border-white/10">
                    <span className="text-sm text-muted-foreground font-medium">
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

