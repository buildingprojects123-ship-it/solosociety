import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [outgoing, incoming] = await Promise.all([
      prisma.connection.findMany({
        where: { senderId: userId },
        select: {
          id: true,
          receiverId: true,
          status: true,
        },
      }),
      prisma.connection.findMany({
        where: { receiverId: userId },
        select: {
          id: true,
          senderId: true,
          status: true,
        },
      }),
    ])

    return NextResponse.json({
      outgoing,
      incoming,
    })
  } catch (error) {
    console.error('Connection status error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

