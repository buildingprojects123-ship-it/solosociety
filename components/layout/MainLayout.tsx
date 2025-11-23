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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-500/30 pb-16 lg:pb-0">
      {/* Top Navigation - Fixed on Mobile/Tablet */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/5 lg:relative lg:border-none">
        <TopNav />
      </div>

      <div className="max-w-[1400px] mx-auto w-full flex justify-center lg:gap-6 lg:px-6 lg:py-6">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto scrollbar-hide">
          <LeftSidebar />
        </aside>

        {/* Main Content */}
        <main className={`flex-1 min-w-0 w-full max-w-2xl ${isMessagesPage ? 'p-0' : 'px-4 py-4 lg:p-0'}`}>
          {children}
        </main>

        {/* Right Sidebar - Desktop Only */}
        {!isMessagesPage && (
          <aside className="hidden xl:block w-[340px] flex-shrink-0 sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto scrollbar-hide">
            <RightSidebar />
          </aside>
        )}
      </div>

      {/* Bottom Navigation - Mobile/Tablet Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/10 bg-black/90 backdrop-blur-lg safe-area-bottom">
        <BottomNav />
      </div>
    </div>
  )
}
