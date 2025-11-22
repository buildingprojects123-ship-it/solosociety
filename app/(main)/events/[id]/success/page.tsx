import Link from 'next/link'

export default function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { conversationId?: string }
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-card border border-white/5 rounded-xl shadow-lg shadow-black/20 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <span className="text-3xl text-green-500">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground">
            Your seat has been reserved. We&apos;ll see you at the dinner!
          </p>
        </div>

        <div className="space-y-3">
          {searchParams.conversationId && (
            <Link
              href={`/messages?id=${searchParams.conversationId}`}
              className="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
            >
              💬 Join Group Chat
            </Link>
          )}
          <Link
            href={`/events/${params.id}`}
            className="block w-full bg-secondary/50 text-foreground py-3 px-4 rounded-lg hover:bg-secondary hover:text-white transition-colors font-medium border border-white/5"
          >
            View Event Details
          </Link>
          <Link
            href="/events"
            className="block w-full bg-secondary/50 text-foreground py-3 px-4 rounded-lg hover:bg-secondary hover:text-white transition-colors font-medium border border-white/5"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  )
}

