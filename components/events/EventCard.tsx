'use client'

import Image from 'next/image'
import Link from 'next/link'

interface EventCardProps {
  event: {
    id: string
    title: string
    description?: string
    dateTime: string
    locationName: string
    locationAddress?: string
    imageUrl: string | null
    maxSeats: number
    bookedSeats?: number
    price: number
    status?: string
  }
}

export default function EventCard({ event }: EventCardProps) {
  const seatsLeft = event.maxSeats - (event.bookedSeats || 0)
  const isSoldOut = seatsLeft === 0
  const priceDisplay = event.price === 0 ? 'Free' : `₹${event.price}`

  return (
    <Link href={`/events/${event.id}`}>
      <article className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300 group cursor-pointer">
        {/* Event Image */}
        <div className="relative w-full aspect-video bg-secondary/50 overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

          {isSoldOut && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <span className="px-4 py-2 bg-red-500/20 text-red-200 border border-red-500/50 font-semibold rounded-lg backdrop-blur-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{event.dateTime}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="line-clamp-1">{event.locationName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Seats: </span>
                <span className={`font-medium ${isSoldOut ? 'text-red-400' : 'text-foreground'}`}>
                  {seatsLeft} left
                </span>
              </div>
              <div className="text-sm font-semibold text-primary">{priceDisplay}</div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

