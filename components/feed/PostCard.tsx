'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PostActions from './PostActions'
import PostComments from './PostComments'

type PostType = 'regular' | 'event' | 'place'

interface BasePost {
  id: string
  type?: PostType
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
}

interface RegularPost extends BasePost {
  type?: 'regular'
  content: string | null
  imageUrl: string | null
  location: string | null
}

interface EventPost extends BasePost {
  type: 'event'
  eventId: string
  title: string
  dateTime: string
  venue: string
  imageUrl: string
  mutualsGoing: number
  price: string | 'Free'
  ctaLabel?: string
}

interface PlacePost extends BasePost {
  type: 'place'
  placeId: string
  placeName: string
  city: string
  imageUrl: string
  vibeTags: string[]
  friendsWhoWent: Array<{ id: string; name: string; avatar?: string }>
  review?: string
}

type Post = RegularPost | EventPost | PlacePost

interface PostCardProps {
  post: Post
  currentUserId?: string
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)

  const isLiked = post.likes.some((like) => like.userId === currentUserId)
  const likeCount = post.likes.length
  const commentCount = post.comments.length

  const userName = post.user.profile?.name || 'User'
  const userInitial = userName.charAt(0).toUpperCase()
  const postType: PostType = post.type ?? 'regular'

  const renderRegularContent = (regularPost: RegularPost) => {
    if (regularPost.imageUrl) {
      return (
        <div className="relative w-full aspect-square bg-secondary/50">
          <Image
            src={regularPost.imageUrl}
            alt={regularPost.content || 'Post image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {regularPost.content && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex items-end">
              <p className="text-white text-sm font-medium px-4 pb-4 w-full leading-relaxed drop-shadow-lg line-clamp-3">
                {regularPost.content}
              </p>
            </div>
          )}
        </div>
      )
    }

    if (regularPost.content) {
      return (
        <div className="px-4 py-4">
          <p className="text-sm text-foreground leading-relaxed line-clamp-4">
            {regularPost.content}
          </p>
        </div>
      )
    }

    return null
  }

  const renderEventContent = (eventPost: EventPost) => (
    <Link href={`/events/${eventPost.eventId}`} className="block group">
      <div className="relative w-full aspect-square bg-secondary/50 overflow-hidden">
        <Image
          src={eventPost.imageUrl}
          alt={eventPost.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="text-white font-semibold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs">
            {eventPost.price}
          </span>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-card/50 border-b border-white/5">
        <h3 className="text-foreground text-base font-bold mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
          {eventPost.title}
        </h3>
        <div className="flex items-center gap-3 text-muted-foreground text-xs mb-1.5">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {eventPost.dateTime}
          </span>
          <span className="flex items-center gap-1 truncate">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{eventPost.venue}</span>
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          {eventPost.mutualsGoing > 0 ? `${eventPost.mutualsGoing} friends attending` : 'Be the first!'}
        </p>
      </div>
    </Link>
  )

  const renderPlaceContent = (placePost: PlacePost) => (
    <Link href={`/places/${placePost.placeId}`} className="block group">
      <div className="relative w-full aspect-square bg-secondary/50 overflow-hidden">
        <Image
          src={placePost.imageUrl}
          alt={placePost.placeName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="px-4 py-2.5 bg-card/50 border-b border-white/5">
        <h3 className="text-foreground text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {placePost.placeName}
        </h3>

        {/* City, Tags, and Rating on same line */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-muted-foreground">{placePost.city}</span>
          {placePost.vibeTags.length > 0 && (
            <>
              <span className="text-muted-foreground/50">•</span>
              {placePost.vibeTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </>
          )}
          {placePost.review && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-muted-foreground italic line-clamp-1">"{placePost.review}"</span>
            </>
          )}
        </div>

        {placePost.friendsWhoWent.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-2">
              {placePost.friendsWhoWent.slice(0, 3).map((friend) => (
                <div
                  key={friend.id}
                  className="w-5 h-5 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                >
                  <span className="text-[10px] text-primary font-medium">
                    {friend.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-[10px]">
              {placePost.friendsWhoWent.length} friend{placePost.friendsWhoWent.length > 1 ? 's' : ''} checked in
            </p>
          </div>
        )}
      </div>
    </Link>
  )

  const renderContent = () => {
    if (postType === 'event') {
      return renderEventContent(post as EventPost)
    }
    if (postType === 'place') {
      return renderPlaceContent(post as PlacePost)
    }
    return renderRegularContent(post as RegularPost)
  }

  const renderLocation = () => {
    if (postType !== 'regular') return null
    const location = (post as RegularPost).location
    if (!location) return null

    return <p className="text-xs text-muted-foreground">{location}</p>
  }

  const renderTextCaption = () => {
    if (postType !== 'regular') return null
    const regularPost = post as RegularPost
    if (!regularPost.content || regularPost.imageUrl) return null

    return (
      <div className="px-4 py-2">
        <p className="text-sm text-foreground">
          <span className="font-semibold mr-2">{userName}</span>
          {regularPost.content}
        </p>
      </div>
    )
  }

  return (
    <article className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <span className="text-white text-xs font-semibold">{userInitial}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            {renderLocation()}
          </div>
        </div>
        <button className="p-1 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {renderContent()}
      {renderTextCaption()}

      <PostActions
        postId={post.id}
        isLiked={isLiked}
        likeCount={likeCount}
        commentCount={commentCount}
        onCommentClick={() => setShowComments((prev) => !prev)}
      />

      {showComments && <PostComments postId={post.id} comments={post.comments} />}
    </article>
  )
}
