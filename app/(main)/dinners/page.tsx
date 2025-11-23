import { prisma } from '@/lib/prisma'
import EventChromaGrid from '@/components/events/EventChromaGrid'
import EmptyState from '@/components/ui/EmptyState'

// Generate gradient colors based on event index
const gradients = [
  'linear-gradient(145deg, #3B82F6, #000)',
  'linear-gradient(180deg, #10B981, #000)',
  'linear-gradient(210deg, #F59E0B, #000)',
  'linear-gradient(195deg, #EF4444, #000)',
  'linear-gradient(225deg, #8B5CF6, #000)',
  'linear-gradient(135deg, #06B6D4, #000)',
  'linear-gradient(165deg, #EC4899, #000)',
  'linear-gradient(120deg, #14B8A6, #000)',
]

const borderColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
  '#14B8A6',
]

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

  // Transform events for ChromaGrid
  const chromaEvents = events.map((event, index) => {
    const seatsBooked = event.bookings.length
    const seatsLeft = event.maxSeats - seatsBooked
    const gradientIndex = index % gradients.length

    // Format date consistently to avoid hydration issues
    const eventDate = new Date(event.dateTime)
    const dateTimeString = eventDate.toISOString()

    return {
      id: event.id,
      image: event.imageUrl || 'https://placehold.co/400x300/e5e7eb/6b7280?text=Dinner',
      title: event.title,
      subtitle: event.description || 'Dinner experience',
      dateTime: dateTimeString,
      location: event.locationName,
      price: event.price === 0 ? 'Free' : `₹${event.price}`,
      seatsLeft,
      borderColor: borderColors[gradientIndex],
      gradient: gradients[gradientIndex],
      url: `/events/${event.id}`,
    }
  })

  // TODO: Add theme filtering (Founders Night, Students Night, Creators Night)
  const themes = ['All', 'Founders Night', 'Students Night', 'Creators Night']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dinner With Strangers</h1>
        <p className="text-muted-foreground">Curated dinner experiences with interesting people</p>
      </div>

      {/* Theme Filter */}
      <div className="bg-card border border-white/5 rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Theme</label>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-white/5 hover:border-white/10"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Events ChromaGrid */}
      {chromaEvents.length === 0 ? (
        <EmptyState
          title="No dinners scheduled"
          description="Check back soon for new dinner experiences!"
        />
      ) : (
        <EventChromaGrid
          events={chromaEvents}
          radius={400}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      )}
    </div>
  )
}

