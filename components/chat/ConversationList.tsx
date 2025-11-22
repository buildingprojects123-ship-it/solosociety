'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getConversations } from '@/app/actions/chat'

interface Conversation {
    id: string
    name: string
    lastMessage: string
    time: string
    unread: number
    avatar?: string
    type: string
}

interface ConversationListProps {
    selectedId?: string
    onSelect: (id: string) => void
}

export default function ConversationList({ selectedId, onSelect }: ConversationListProps) {
    const [filter, setFilter] = useState<'ALL' | 'Direct' | 'Groups'>('ALL')
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations()
                setConversations(data)
            } catch (error) {
                console.error('Failed to fetch conversations:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchConversations()
        // Poll for updates every 10 seconds
        const interval = setInterval(fetchConversations, 10000)
        return () => clearInterval(interval)
    }, [])

    const filteredConversations = conversations.filter((conv) => {
        if (filter === 'ALL') return true
        if (filter === 'Direct') return conv.type === 'ONE_TO_ONE'
        if (filter === 'Groups') return conv.type !== 'ONE_TO_ONE'
        return true
    })

    if (loading) {
        return <div className="p-4 text-center text-muted-foreground">Loading...</div>
    }

    return (
        <div className="flex flex-col h-full bg-card border-r border-white/5">
            <div className="p-4 border-b border-white/5">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="flex gap-2">
                    {['ALL', 'Direct', 'Groups'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                                filter === f
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No conversations yet.
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={cn(
                                'w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5',
                                selectedId === conv.id && 'bg-white/5'
                            )}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
                                {conv.avatar ? (
                                    <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold text-primary">
                                        {conv.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-medium truncate">{conv.name}</span>
                                    <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-[10px] font-bold text-white">{conv.unread}</span>
                                </div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}
