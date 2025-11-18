import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default async function RightSidebar() {
  const session = await getServerSession(authOptions)
  const profile = session?.user?.id
    ? await prisma.profile.findUnique({
        where: { userId: session.user.id },
      })
    : null

  const travelNews = [
    { title: 'Goa Tourism Sees 40% Growth', time: '2h', readers: '1.2k' },
    { title: 'New Adventure Trails Open', time: '4h', readers: '856' },
    { title: 'Travel Safety Guidelines Updated', time: '6h', readers: '2.1k' },
    { title: 'Sustainable Tourism Initiative', time: '8h', readers: '1.5k' },
  ]

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto h-screen sticky top-0">
      {/* Travel News */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📈</span>
          <h3 className="font-semibold text-gray-900">Travel News</h3>
        </div>
        <div className="space-y-3">
          {travelNews.map((news, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-900 mb-1">
                {news.title}
              </p>
              <p className="text-xs text-gray-500">
                {news.time} • {news.readers} readers
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⭐</span>
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/feed/create">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="text-2xl mb-2">➕</div>
              <p className="text-xs font-medium text-gray-700">Create Post</p>
            </div>
          </Link>
          <Link href="/events">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-xs font-medium text-gray-700">Plan Trip</p>
            </div>
          </Link>
          <Link href="/events">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-xs font-medium text-gray-700">Find Events</p>
            </div>
          </Link>
          <Link href="/feed/groups">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-xs font-medium text-gray-700">Create Group</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Weather */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">☀️</span>
          <h3 className="font-semibold text-gray-900">Weather</h3>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {profile?.city || 'Mumbai'}, India
              </p>
              <p className="text-2xl font-bold text-gray-900">28°C</p>
            </div>
            <div className="text-4xl">☀️</div>
          </div>
          <p className="text-sm text-gray-600 mb-2">Sunny</p>
          <p className="text-xs text-gray-500 mb-1">
            Perfect for beach activities
          </p>
          <div className="flex gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-yellow-200">
            <span>Humidity: 65%</span>
            <span>Wind: 12 km/h</span>
          </div>
        </div>
      </div>
    </div>
  )
}

