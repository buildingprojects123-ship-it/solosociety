import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { connectionId, action } = body

    if (!connectionId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    })

    if (!connection || connection.receiverId !== session.user.id) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    if (action === 'accept') {
      await prisma.connection.update({
        where: { id: connectionId },
        data: { status: 'ACCEPTED' },
      })
    } else {
      await prisma.connection.update({
        where: { id: connectionId },
        data: { status: 'REJECTED' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Connection respond error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

