'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function StoriesBar() {
  const { data: session } = useSession()

  // Mock stories - in real app, fetch from API
  const stories = [
    { id: '1', name: 'Your Story', isOwn: true },
    { id: '2', name: 'Alice', isOwn: false },
    { id: '3', name: 'Bob', isOwn: false },
    { id: '4', name: 'Charlie', isOwn: false },
    { id: '5', name: 'Diana', isOwn: false },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div
              className={`w-14 h-14 rounded-full p-0.5 ${
                story.isOwn
                  ? 'border border-gray-300'
                  : 'border-2 border-transparent bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
              }`}
            >
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                <span className="text-sm font-semibold text-gray-600">
                  {story.name.charAt(0)}
                </span>
              </div>
            </div>
            <p className="text-xs mt-1.5 text-gray-600 max-w-[56px] truncate">
              {story.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

