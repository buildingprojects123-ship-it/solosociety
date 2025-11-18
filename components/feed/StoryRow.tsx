'use client'

import { useState } from 'react'
import Image from 'next/image'

// TODO: Replace with real data from API
const stories = [
  { id: '1', userId: 'user1', name: 'Your Story', image: 'https://placehold.co/80x80/e5e7eb/9ca3af?text=You', isOwn: true },
  { id: '2', userId: 'user2', name: 'Alice', image: 'https://placehold.co/80x80/dbeafe/3b82f6?text=A', isOwn: false },
  { id: '3', userId: 'user3', name: 'Bob', image: 'https://placehold.co/80x80/fce7f3/ec4899?text=B', isOwn: false },
  { id: '4', userId: 'user4', name: 'Charlie', image: 'https://placehold.co/80x80/fef3c7/f59e0b?text=C', isOwn: false },
  { id: '5', userId: 'user5', name: 'Diana', image: 'https://placehold.co/80x80/e0e7ff/6366f1?text=D', isOwn: false },
]

interface StoryModalProps {
  story: typeof stories[0]
  isOpen: boolean
  onClose: () => void
}

function StoryModal({ story, isOpen, onClose }: StoryModalProps) {
  if (!isOpen) return null

  // TODO: Fetch and display user's recent posts/places/events
  const recentPosts = [
    { id: '1', type: 'place', title: 'Café Mondegar', image: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Cafe' },
    { id: '2', type: 'event', title: 'Dinner With Strangers', image: 'https://placehold.co/400x300/dbeafe/3b82f6?text=Event' },
  ]

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{story.name}'s Recent Activity</h3>
          </div>
          <div className="p-4 space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{post.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StoryRow() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null)

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.isOwn
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                }`}
              >
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                    {story.image && (
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
              {story.isOwn && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 max-w-[64px] truncate">{story.name}</span>
          </button>
        ))}
      </div>

      {selectedStory && (
        <StoryModal
          story={selectedStory}
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  )
}

