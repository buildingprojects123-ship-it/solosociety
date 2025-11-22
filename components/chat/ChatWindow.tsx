'use client'

import { useState, useRef, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { getMessages, sendMessage } from '@/app/actions/chat'

interface Message {
    id: string
    content: string
    senderId: string
    senderName: string
    createdAt: Date
    isMe: boolean
}

interface ChatWindowProps {
    conversationId: string
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const fetchMessages = async () => {
        try {
            const data = await getMessages(conversationId)
            setMessages(data)
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchMessages()

        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [conversationId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const tempId = Date.now().toString()
        const content = newMessage
        setNewMessage('')

        // Optimistic update
        const tempMsg: Message = {
            id: tempId,
            content,
            senderId: 'me',
            senderName: 'Me',
            createdAt: new Date(),
            isMe: true,
        }
        setMessages((prev) => [...prev, tempMsg])

        try {
            await sendMessage(conversationId, content)
            await fetchMessages() // Refresh to get the real message ID and server timestamp
        } catch (error) {
            console.error('Failed to send message:', error)
            // Remove optimistic message on error (simplified)
            setMessages((prev) => prev.filter(m => m.id !== tempId))
            alert('Failed to send message')
        }
    }

    if (loading && messages.length === 0) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Loading messages...</div>
    }

    return (
        <div className="flex flex-col h-full bg-background/50">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">C</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">Conversation</h3>
                        {/* <p className="text-xs text-muted-foreground">3 participants</p> */}
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.isMe
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-white/10 text-foreground rounded-tl-none'
                                }`}
                        >
                            {!msg.isMe && (
                                <p className="text-xs text-white/50 mb-1">{msg.senderName}</p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-white/70' : 'text-white/30'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-card/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-white/5 border-white/10 focus:border-primary/50"
                    />
                    <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </Button>
                </form>
            </div>
        </div>
    )
}
