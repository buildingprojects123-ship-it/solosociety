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
    const { postId, content } = body

    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { message: 'Post ID and content are required' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        postId,
        content: content.trim(),
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Comment API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

