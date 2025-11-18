import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ConnectionRequestCard from '@/components/feed/ConnectionRequestCard'
import EmptyState from '@/components/ui/EmptyState'

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const pendingRequests = await prisma.connection.findMany({
    where: {
      receiverId: session.user.id,
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: {
        include: {
          profile: true,
        },
      },
    },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">
          Connection requests and social updates appear here.
        </p>
      </div>

      {pendingRequests.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="When someone wants to connect with you, the request will appear here."
        />
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <ConnectionRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}

