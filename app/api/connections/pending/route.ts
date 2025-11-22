import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const countOnly = searchParams.get('countOnly') === 'true'

    const pending = await prisma.connection.findMany({
      where: {
        receiverId: session.user.id,
        status: 'PENDING',
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (countOnly) {
      return NextResponse.json({ count: pending.length })
    }

    return NextResponse.json({ pending })
  } catch (error) {
    console.error('Pending connections error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

