'use client'

import { ReactNode } from 'react'
import LeftSidebar from './LeftSidebar'
import TopNav from './TopNav'
import RightSidebar from './RightSidebar'
import BottomNav from '@/components/BottomNav'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isOnboarding = pathname?.includes('/onboarding')

  if (isOnboarding) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop / Tablet Layout */}
      <div className="hidden lg:flex lg:flex-col min-h-screen">
        <TopNav />
        <div className="flex-1 w-full px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)] xl:grid-cols-[240px,minmax(0,1fr),320px]">
            <div className="hidden lg:block">
              <LeftSidebar />
            </div>
            <main className="min-w-0">
              <div className="max-w-3xl mx-auto w-full">
                {children}
              </div>
              {/* Inline widgets for narrower desktops */}
              <div className="mt-8 xl:hidden">
                <RightSidebar variant="inline" />
              </div>
            </main>
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-6 space-y-6">
            {children}
            <RightSidebar variant="inline" />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

