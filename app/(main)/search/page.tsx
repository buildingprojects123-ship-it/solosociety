import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import EventCard from '@/components/events/EventCard'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q: string }
}) {
    const query = searchParams.q

    if (!query) {
        return <div className="p-8 text-center text-muted-foreground">Please enter a search term</div>
    }

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { profile: { name: { contains: query } } },
                { profile: { city: { contains: query } } },
            ],
        },
        include: { profile: true },
        take: 5,
    })

    const events = await prisma.event.findMany({
        where: {
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { locationName: { contains: query } },
            ],
        },
        take: 10,
    })

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>

            {/* Users */}
            <section>
                <h2 className="text-xl font-semibold mb-4">People</h2>
                {users.length === 0 ? (
                    <p className="text-muted-foreground">No people found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/profile/${user.id}`}
                                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-lg font-bold text-primary">
                                        {user.profile?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-medium">{user.profile?.name || 'Unknown User'}</h3>
                                    <p className="text-sm text-muted-foreground">{user.profile?.city}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Events */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Events</h2>
                {events.length === 0 ? (
                    <p className="text-muted-foreground">No events found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={{
                                    ...event,
                                    dateTime: event.dateTime.toISOString(),
                                    bookedSeats: 0, // TODO: Fetch actual booked seats
                                }}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
