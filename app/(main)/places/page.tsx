import PlaceCard from '@/components/places/PlaceCard'
import EmptyState from '@/components/ui/EmptyState'

// TODO: Replace with real data from API
const mockPlaces = [
  {
    id: '1',
    name: 'Café Mondegar',
    neighborhood: 'Colaba',
    city: 'Mumbai',
    imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Place',
    vibeTags: ['Chill', 'Work', 'Coffee'],
    friendsCount: 12,
    rating: 4.5,
    reviews: [
      { friend: 'Alice', review: 'Great for work/coffee' },
      { friend: 'Bob', review: 'Perfect vibe for studying' },
    ],
  },
  {
    id: '2',
    name: 'The Bombay Canteen',
    neighborhood: 'Lower Parel',
    city: 'Mumbai',
    imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Place',
    vibeTags: ['Date', 'Dinner', 'Loud'],
    friendsCount: 8,
    rating: 4.8,
    reviews: [{ friend: 'Charlie', review: 'Amazing food and atmosphere' }],
  },
  {
    id: '3',
    name: 'Social',
    neighborhood: 'Bandra',
    city: 'Mumbai',
    imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Place',
    vibeTags: ['Loud', 'Party', 'Sunset'],
    friendsCount: 15,
    rating: 4.2,
    reviews: [{ friend: 'Diana', review: 'Best place for evening drinks' }],
  },
  {
    id: '4',
    name: 'Le15',
    neighborhood: 'Colaba',
    city: 'Mumbai',
    imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Place',
    vibeTags: ['Chill', 'Date', 'Study'],
    friendsCount: 6,
    rating: 4.6,
    reviews: [{ friend: 'Eve', review: 'Cozy spot for dates' }],
  },
]

export default async function PlacesPage() {
  // TODO: Fetch places from API
  // const places = await prisma.place.findMany({ ... })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Places</h1>
        <p className="text-gray-600">Discover spots your friends love</p>
      </div>

      {/* Places Grid */}
      {mockPlaces.length === 0 ? (
        <EmptyState
          title="No places yet"
          description="Check back soon for new places!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}

