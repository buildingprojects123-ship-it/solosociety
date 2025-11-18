import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { userId } = body

    if (!userId || userId === session.user.id) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Check if connection already exists
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Connection request already exists' },
        { status: 400 }
      )
    }

    const connection = await prisma.connection.create({
      data: {
        senderId: session.user.id,
        receiverId: userId,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ connection })
  } catch (error) {
    console.error('Connection request error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

