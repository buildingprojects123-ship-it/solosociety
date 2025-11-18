import { prisma } from '@/lib/prisma'
import EventCard from '@/components/events/EventCard'
import EmptyState from '@/components/ui/EmptyState'

export default async function DinnersPage() {
  // TODO: Filter for "Dinner With Strangers" events specifically
  // For now, we'll show all upcoming events
  const events = await prisma.event.findMany({
    where: { status: 'UPCOMING' },
    orderBy: { dateTime: 'asc' },
    include: {
      bookings: true,
    },
  })

  // Transform events for EventCard
  const eventCards = events.map((event) => {
    const seatsBooked = event.bookings.length
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      dateTime: new Date(event.dateTime).toLocaleString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      locationName: event.locationName,
      locationAddress: event.locationAddress,
      imageUrl: event.imageUrl,
      maxSeats: event.maxSeats,
      bookedSeats: seatsBooked,
      price: event.price,
      status: event.status,
    }
  })

  // TODO: Add theme filtering (Founders Night, Students Night, Creators Night)
  const themes = ['All', 'Founders Night', 'Students Night', 'Creators Night']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dinner With Strangers</h1>
        <p className="text-gray-600">Curated dinner experiences with interesting people</p>
      </div>

      {/* Theme Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {eventCards.length === 0 ? (
        <EmptyState
          title="No dinners scheduled"
          description="Check back soon for new dinner experiences!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventCards.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

