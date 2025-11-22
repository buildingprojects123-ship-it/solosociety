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
  const isMessagesPage = pathname?.startsWith('/messages')

  if (isOnboarding) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-500/30">
      {/* Desktop / Tablet Layout */}
      <div className="hidden lg:flex lg:flex-col h-screen overflow-hidden">
        <TopNav />
        <div className="flex-1 flex overflow-hidden">
          <div className={`max-w-[1400px] mx-auto w-full flex gap-6 ${isMessagesPage ? 'p-0' : 'px-6 py-6'}`}>
            {/* Left Sidebar - Fixed */}
            <div className="hidden lg:block w-[260px] flex-shrink-0">
              <div className="h-full overflow-y-auto scrollbar-hide">
                <LeftSidebar />
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <main className="flex-1 min-w-0 overflow-y-auto scrollbar-hide">
              {children}
            </main>

            {/* Right Sidebar - Fixed */}
            {!isMessagesPage && (
              <div className="hidden xl:block w-[340px] flex-shrink-0">
                <div className="h-full overflow-y-auto scrollbar-hide">
                  <RightSidebar />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inline widgets for narrower desktops (no XL screen) */}
        {!isMessagesPage && (
          <div className="hidden lg:block xl:hidden overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 pb-6">
              <RightSidebar variant="inline" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-6 space-y-6">
            {children}
            {!isMessagesPage && <RightSidebar variant="inline" />}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
