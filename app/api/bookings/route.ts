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
    const userId = searchParams.get('userId') ?? session.user.id

    if (userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Bookings GET error:', error)
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
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Check if event exists and has available seats
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        bookings: true,
      },
    })

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    if (event.status !== 'UPCOMING') {
      return NextResponse.json(
        { message: 'Cannot book past events' },
        { status: 400 }
      )
    }

    const seatsBooked = event.bookings.length
    if (seatsBooked >= event.maxSeats) {
      return NextResponse.json(
        { message: 'Event is sold out' },
        { status: 400 }
      )
    }

    // Check if user already has a booking
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: event.id,
        },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { message: 'You already have a booking for this event' },
        { status: 400 }
      )
    }

    // Create booking
    await prisma.booking.create({
      data: {
        userId: session.user.id,
        eventId: event.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Booking API error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'You already have a booking for this event' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Find and delete the booking
    const booking = await prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId,
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      )
    }

    await prisma.booking.delete({
      where: {
        id: booking.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Booking cancelled' })
  } catch (error: any) {
    console.error('Cancel booking error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

