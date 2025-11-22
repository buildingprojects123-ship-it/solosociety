'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getConversations() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return []

    const participations = await prisma.participant.findMany({
        where: { userId: session.user.id },
        include: {
            conversation: {
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                    participants: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            conversation: {
                updatedAt: 'desc',
            },
        },
    })

    return participations.map((p) => {
        const conv = p.conversation
        const lastMsg = conv.messages[0]

        // Determine name and avatar based on type
        let name = conv.name
        let avatar = undefined

        if (conv.type === 'ONE_TO_ONE') {
            const otherParticipant = conv.participants.find(part => part.userId !== session.user.id)
            if (otherParticipant) {
                name = otherParticipant.user.profile?.name || otherParticipant.user.phone
                // avatar = otherParticipant.user.profile?.avatarUrl
            }
        }

        return {
            id: conv.id,
            name: name || 'Unknown Conversation',
            lastMessage: lastMsg?.content || 'No messages yet',
            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            timestamp: lastMsg?.createdAt || conv.createdAt,
            unread: 0, // TODO: Implement unread count logic
            type: conv.type,
            avatar,
        }
    })
}

export async function getMessages(conversationId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return []

    // Verify participation
    const participation = await prisma.participant.findUnique({
        where: {
            userId_conversationId: {
                userId: session.user.id,
                conversationId,
            },
        },
    })

    if (!participation) throw new Error('Unauthorized')

    const messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
            sender: {
                include: {
                    profile: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    })

    return messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.profile?.name || msg.sender.phone,
        createdAt: msg.createdAt,
        isMe: msg.senderId === session.user.id,
    }))
}

export async function sendMessage(conversationId: string, content: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    if (!content.trim()) return

    const message = await prisma.message.create({
        data: {
            content,
            conversationId,
            senderId: session.user.id,
        },
    })

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    })

    revalidatePath('/messages')
    return message
}

export async function createDirectConversation(targetUserId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    // Check if conversation already exists
    // This is a bit complex in Prisma without a direct many-to-many check, 
    // but for now we'll just create a new one or find one where both are participants.
    // A proper implementation would check for an existing ONE_TO_ONE conversation with these exact 2 participants.

    const conversation = await prisma.conversation.create({
        data: {
            type: 'ONE_TO_ONE',
            participants: {
                create: [
                    { userId: session.user.id },
                    { userId: targetUserId },
                ],
            },
        },
    })

    revalidatePath('/messages')
    return conversation.id
}
