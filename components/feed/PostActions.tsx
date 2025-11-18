'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface PostActionsProps {
  postId: string
  isLiked: boolean
  likeCount: number
  commentCount: number
  onCommentClick: () => void
}

export default function PostActions({
  postId,
  isLiked: initialLiked,
  likeCount: initialLikeCount,
  commentCount,
  onCommentClick,
}: PostActionsProps) {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    const wasLiked = isLiked

    // Optimistic update
    setIsLiked(!isLiked)
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1))

    try {
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(wasLiked)
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1))
      }
    } catch (error) {
      // Revert on error
      setIsLiked(wasLiked)
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleLike}
          disabled={isLoading || !session}
          className="transition-colors"
        >
          {isLiked ? (
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
        <button
          onClick={onCommentClick}
          className="text-gray-900 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
        <button className="text-gray-900 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
      {likeCount > 0 && (
        <p className="text-sm font-semibold text-gray-900 mb-1">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </p>
      )}
      {commentCount > 0 && (
        <button
          onClick={onCommentClick}
          className="text-sm text-gray-500 hover:text-gray-900 mb-1"
        >
          View all {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </button>
      )}
    </div>
  )
}

