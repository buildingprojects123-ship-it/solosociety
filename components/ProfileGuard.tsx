'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function ProfileGuard({
  children,
  hasProfile,
}: {
  children: React.ReactNode
  hasProfile: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Redirect to onboarding if profile incomplete (except when already on onboarding)
    if (!hasProfile && !pathname?.includes('/onboarding')) {
      router.push('/onboarding')
    }
  }, [hasProfile, pathname, router])

  // Don't render children if redirecting
  if (!hasProfile && !pathname?.includes('/onboarding')) {
    return null
  }

  return <>{children}</>
}

