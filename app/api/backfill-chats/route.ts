import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {

        const events = await prisma.event.findMany({
            include: {
                // @ts-ignore - conversations relation exists in schema
                conversations: true,
                bookings: true,
            },
        })

        let createdCount = 0

        for (const event of events) {

            // @ts-ignore - conversations property exists at runtime
            console.log(`Processing event: ${event.id}, conversations: ${event.conversations?.length}`)

            // @ts-ignore - conversations property exists at runtime
            if (!event.conversations || event.conversations.length === 0) {
                // Collect participant IDs - only from bookings since createdBy might not be a user ID

                // @ts-ignore - bookings property exists at runtime
                const participantIds = new Set(event.bookings.map((b: any) => b.userId))

                // Try to add creator if they're a valid user
                const creator = await prisma.user.findUnique({ where: { id: event.createdBy } })
                if (creator) {
                    participantIds.add(event.createdBy)
                }

                console.log(`Creating conversation for ${event.title} with ${participantIds.size} participants`)

                if (participantIds.size > 0) {

                    // @ts-ignore - conversation model exists in schema
                    await prisma.conversation.create({
                        data: {
                            type: 'EVENT',
                            name: event.title,
                            eventId: event.id,
                            participants: {
                                create: Array.from(participantIds).map((userId) => ({ userId })),
                            },
                        },
                    })
                    createdCount++
                }
            }
        }

        return NextResponse.json({ success: true, createdCount })
    } catch (error) {
        console.error('Backfill error:', error)
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    }
}
