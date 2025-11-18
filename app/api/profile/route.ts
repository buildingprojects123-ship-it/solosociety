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
    const { name, age, city, interests } = body

    if (!name || !city || !interests || interests.length !== 3) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upsert profile
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        name,
        age: age || null,
        city,
        interests: JSON.stringify(interests),
      },
      create: {
        userId: session.user.id,
        name,
        age: age || null,
        city,
        interests: JSON.stringify(interests),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...profile,
      userId: session.user.id,
      interests: JSON.parse(profile.interests),
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

