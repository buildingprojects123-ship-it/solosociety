import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { content, imageUrl, location } = body

    if (!content && !imageUrl) {
      return NextResponse.json(
        { message: 'Content or image is required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content: content || null,
        imageUrl: imageUrl || null,
        location: location || null,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: false,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

