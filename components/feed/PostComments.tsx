'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface PostCommentsProps {
  postId: string
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    user: {
      profile: {
        name: string
      } | null
    }
  }>
}

export default function PostComments({ postId, comments: initialComments }: PostCommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session?.user?.id) return

    setIsLoading(true)
    const tempId = `temp-${Date.now()}`
    const tempComment = {
      id: tempId,
      content: newComment,
      createdAt: new Date(),
      user: {
        profile: {
          name: session.user.phone,
        },
      },
    }

    // Optimistic update
    setComments([...comments, tempComment as any])
    setNewComment('')

    try {
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: newComment }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? data.comment : c))
        )
      } else {
        // Remove temp comment on error
        setComments((prev) => prev.filter((c) => c.id !== tempId))
        setNewComment(newComment)
      }
    } catch (error) {
      setComments((prev) => prev.filter((c) => c.id !== tempId))
      setNewComment(newComment)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-gray-200 px-4 py-2">
      <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-gray-600">
                {comment.user.profile?.name.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-semibold mr-2">
                  {comment.user.profile?.name || 'User'}
                </span>
                {comment.content}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {session && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm border-0 focus:outline-none focus:ring-0"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

