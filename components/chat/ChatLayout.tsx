'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

export default function ChatLayout() {
    const searchParams = useSearchParams()
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

    useEffect(() => {
        const id = searchParams.get('id')
        if (id) {
            setSelectedId(id)
        }
    }, [searchParams])

    return (
        <div className="flex h-full overflow-hidden bg-background">
            <div className="w-80 shrink-0 hidden md:block">
                <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <div className="flex-1 min-w-0">
                {selectedId ? (
                    <ChatWindow conversationId={selectedId} />
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    )
}
