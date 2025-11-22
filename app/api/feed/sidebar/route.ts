import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSidebarData } from '@/lib/sidebarData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const data = await getSidebarData(session?.user?.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Sidebar data error:', error)
    return NextResponse.json(
      { message: 'Failed to load sidebar data' },
      { status: 500 }
    )
  }
}

