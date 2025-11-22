'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    const userId = session.user.id

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId,
                postId,
            },
        },
    })

    if (existingLike) {
        await prisma.like.delete({
            where: {
                id: existingLike.id,
            },
        })
    } else {
        await prisma.like.create({
            data: {
                userId,
                postId,
            },
        })
    }

    revalidatePath('/feed')
}

export async function addComment(postId: string, content: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    if (!content.trim()) {
        return
    }

    await prisma.comment.create({
        data: {
            userId: session.user.id,
            postId,
            content,
        },
    })

    revalidatePath('/feed')
}

export async function bookEvent(eventId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    const userId = session.user.id

    // Check if already booked
    const existingBooking = await prisma.booking.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId,
            },
        },
    })

    if (existingBooking) {
        throw new Error('Already booked')
    }

    // Check seat availability
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { bookings: true },
    })

    if (!event) {
        throw new Error('Event not found')
    }

    if (event.bookings.length >= event.maxSeats) {
        throw new Error('Event is full')
    }

    await prisma.booking.create({
        data: {
            userId,
            eventId,
        },
    })

    // Add user to event conversation
    let conversationId: string | null = null
    const conversation = await prisma.conversation.findFirst({
        where: {
            eventId,
            type: 'EVENT',
        },
    })

    if (conversation) {
        await prisma.participant.create({
            data: {
                userId,
                conversationId: conversation.id,
            },
        })
        conversationId = conversation.id
    }

    revalidatePath(`/events/${eventId}`)
    revalidatePath('/events')

    return { conversationId }
}

export async function createEvent(data: any) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const event = await prisma.event.create({
        data: {
            ...data,
            createdBy: session.user.id,
            // Create the conversation for this event immediately
            conversations: {
                create: {
                    type: 'EVENT',
                    name: data.title,
                    participants: {
                        create: {
                            userId: session.user.id
                        }
                    }
                }
            }
        },
    })

    return event
}
