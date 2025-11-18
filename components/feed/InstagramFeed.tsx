'use client'

import PostCard from './PostCard'
import StoriesBar from './StoriesBar'
import SuggestedUsers from './SuggestedUsers'

interface InstagramFeedProps {
  posts: Array<{
    id: string
    content: string | null
    imageUrl: string | null
    location: string | null
    createdAt: Date
    user: {
      id: string
      profile: {
        name: string
        city: string
      } | null
    }
    likes: Array<{ userId: string }>
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
  }>
  currentUserId: string
  suggestedUsers?: Array<{
    id: string
    profile: {
      name: string
      city: string
    } | null
  }>
}

export default function InstagramFeed({
  posts,
  currentUserId,
  suggestedUsers = [],
}: InstagramFeedProps) {
  return (
    <div className="flex gap-8 max-w-6xl mx-auto">
      {/* Main Feed */}
      <div className="flex-1 max-w-2xl">
        {/* Stories */}
        <StoriesBar />

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500 mb-2">No posts yet</p>
              <p className="text-sm text-gray-400">
                Use the create button in the sidebar to share your first post
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar - Suggested Users */}
      <div className="w-80 hidden lg:block">
        <SuggestedUsers users={suggestedUsers} currentUserId={currentUserId} />
      </div>
    </div>
  )
}

