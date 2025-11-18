'use client'

import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'
import ProfileGuard from './ProfileGuard'

export default function ConditionalLayout({
  children,
  hasProfile,
}: {
  children: React.ReactNode
  hasProfile: boolean
}) {
  const pathname = usePathname()
  const isFeedPage = pathname?.startsWith('/feed')

  if (isFeedPage) {
    return <ProfileGuard hasProfile={hasProfile}>{children}</ProfileGuard>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            WhereAt
          </h1>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)]">
        <ProfileGuard hasProfile={hasProfile}>{children}</ProfileGuard>
      </main>
      <BottomNav />
    </div>
  )
}

