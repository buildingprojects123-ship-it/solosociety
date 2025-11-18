'use client'

import Image from 'next/image'
import Link from 'next/link'

interface PlaceCardProps {
  place: {
    id: string
    name: string
    neighborhood: string
    city: string
    imageUrl: string | null
    vibeTags: string[]
    friendsCount: number
    rating?: number
    reviews?: Array<{ friend: string; review: string }>
  }
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`}>
      <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-200 group cursor-pointer">
        {/* Place Image */}
        <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
          {place.imageUrl ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            </div>
          )}
        </div>

        {/* Place Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {place.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{place.neighborhood}, {place.city}</p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {place.vibeTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Friends & Rating */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(place.friendsCount, 3))].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary-200 border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {place.friendsCount} friend{place.friendsCount !== 1 ? 's' : ''} checked in
              </p>
            </div>
            {place.rating && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">{place.rating}</span>
              </div>
            )}
          </div>

          {/* Friend Reviews Preview */}
          {place.reviews && place.reviews.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">
                {place.reviews.length} said: {place.reviews[0].review}
              </p>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

