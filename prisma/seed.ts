import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const interests = [
  'Live Music',
  'Coffee',
  'Tech',
  'Nightlife',
  'Outdoors',
  'Food',
  'Art',
  'Sports',
]

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone: '+911234567890' },
      update: {},
      create: {
        phone: '+911234567890',
        profile: {
          create: {
            name: 'Alice',
            age: 28,
            city: 'Mumbai',
            interests: JSON.stringify(['Live Music', 'Coffee', 'Tech']),
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { phone: '+919876543210' },
      update: {},
      create: {
        phone: '+919876543210',
        profile: {
          create: {
            name: 'Bob',
            age: 32,
            city: 'Mumbai',
            interests: JSON.stringify(['Nightlife', 'Food', 'Art']),
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { phone: '+919988776655' },
      update: {},
      create: {
        phone: '+919988776655',
        profile: {
          create: {
            name: 'Charlie',
            age: 25,
            city: 'Mumbai',
            interests: JSON.stringify(['Outdoors', 'Sports', 'Coffee']),
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { phone: '+919955443322' },
      update: {},
      create: {
        phone: '+919955443322',
        profile: {
          create: {
            name: 'Diana',
            age: 30,
            city: 'Mumbai',
            interests: JSON.stringify(['Tech', 'Food', 'Live Music']),
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { phone: '+919933221100' },
      update: {},
      create: {
        phone: '+919933221100',
        profile: {
          create: {
            name: 'Eve',
            age: 27,
            city: 'Mumbai',
            interests: JSON.stringify(['Art', 'Nightlife', 'Coffee']),
          },
        },
      },
    }),
  ])

  console.log(`Created ${users.length} users`)

  // Create events
  const now = new Date()
  const upcoming1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  const upcoming2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  const upcoming3 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
  const past1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  const past2 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) // 14 days ago

  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: 'event-1' },
      update: {},
      create: {
        id: 'event-1',
        title: 'Dinner With Strangers: Bandra Edition',
        description:
          'Join us for an intimate dinner at a cozy restaurant in Bandra. Great food, great conversations, and new connections await.',
        dateTime: upcoming1,
        locationName: 'The Table',
        locationAddress: 'Bandra West, Mumbai',
        maxSeats: 10,
        price: 1500,
        imageUrl: 'https://picsum.photos/800/600?random=1',
        status: 'UPCOMING',
        createdBy: 'WhereAt Team',
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-2' },
      update: {},
      create: {
        id: 'event-2',
        title: 'Dinner With Strangers: Colaba Night',
        description:
          'Experience fine dining and meaningful conversations in the heart of Colaba. Perfect for food lovers and social butterflies.',
        dateTime: upcoming2,
        locationName: 'The Bombay Canteen',
        locationAddress: 'Colaba, Mumbai',
        maxSeats: 12,
        price: 2000,
        imageUrl: 'https://picsum.photos/800/600?random=2',
        status: 'UPCOMING',
        createdBy: 'WhereAt Team',
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-3' },
      update: {},
      create: {
        id: 'event-3',
        title: 'Dinner With Strangers: Andheri Social',
        description:
          'A casual dinner gathering in Andheri. Come as you are, leave with new friends and great memories.',
        dateTime: upcoming3,
        locationName: 'Social',
        locationAddress: 'Andheri West, Mumbai',
        maxSeats: 8,
        price: 1200,
        imageUrl: 'https://picsum.photos/800/600?random=3',
        status: 'UPCOMING',
        createdBy: 'WhereAt Team',
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-4' },
      update: {},
      create: {
        id: 'event-4',
        title: 'Dinner With Strangers: Powai Lakeside',
        description:
          'A beautiful evening by the lake with amazing food and even better company. One of our most memorable dinners.',
        dateTime: past1,
        locationName: 'Lakeside Cafe',
        locationAddress: 'Powai, Mumbai',
        maxSeats: 10,
        price: 1500,
        imageUrl: 'https://picsum.photos/800/600?random=4',
        status: 'PAST',
        createdBy: 'WhereAt Team',
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-5' },
      update: {},
      create: {
        id: 'event-5',
        title: 'Dinner With Strangers: Worli Rooftop',
        description:
          'Rooftop dining with a view. Great conversations under the stars with an amazing group of people.',
        dateTime: past2,
        locationName: 'Rooftop Restaurant',
        locationAddress: 'Worli, Mumbai',
        maxSeats: 12,
        price: 1800,
        imageUrl: 'https://picsum.photos/800/600?random=5',
        status: 'PAST',
        createdBy: 'WhereAt Team',
      },
    }),
  ])

  console.log(`Created ${events.length} events`)

  // Create some bookings
  const bookings = await Promise.all([
    prisma.booking.upsert({
      where: {
        userId_eventId: {
          userId: users[0].id,
          eventId: events[0].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        eventId: events[0].id,
      },
    }),
    prisma.booking.upsert({
      where: {
        userId_eventId: {
          userId: users[1].id,
          eventId: events[0].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        eventId: events[0].id,
      },
    }),
    prisma.booking.upsert({
      where: {
        userId_eventId: {
          userId: users[2].id,
          eventId: events[0].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        eventId: events[0].id,
      },
    }),
    prisma.booking.upsert({
      where: {
        userId_eventId: {
          userId: users[0].id,
          eventId: events[3].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        eventId: events[3].id,
      },
    }),
    prisma.booking.upsert({
      where: {
        userId_eventId: {
          userId: users[1].id,
          eventId: events[3].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        eventId: events[3].id,
      },
    }),
    prisma.booking.upsert({
      where: {
        userId_eventId: {
          userId: users[2].id,
          eventId: events[4].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        eventId: events[4].id,
      },
    }),
  ])

  console.log(`Created ${bookings.length} bookings`)

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: users[0].id,
        content: 'Just had an amazing dinner experience! The conversations were incredible and I made some great new friends. Can\'t wait for the next one! 🍽️✨',
        imageUrl: 'https://picsum.photos/800/600?random=10',
        location: 'Mumbai',
      },
    }),
    prisma.post.create({
      data: {
        userId: users[1].id,
        content: 'The rooftop dinner was absolutely magical! Great food, great people, and an unforgettable evening under the stars.',
        imageUrl: 'https://picsum.photos/800/600?random=11',
        location: 'Mumbai',
      },
    }),
    prisma.post.create({
      data: {
        userId: users[2].id,
        content: 'Met some amazing people at tonight\'s dinner. The vibe was perfect and the food was delicious!',
        imageUrl: 'https://picsum.photos/800/600?random=12',
        location: 'Mumbai',
      },
    }),
  ])

  console.log(`Created ${posts.length} posts`)

  // Create some likes and comments
  await Promise.all([
    prisma.like.create({
      data: { userId: users[1].id, postId: posts[0].id },
    }),
    prisma.like.create({
      data: { userId: users[2].id, postId: posts[0].id },
    }),
    prisma.comment.create({
      data: {
        userId: users[1].id,
        postId: posts[0].id,
        content: 'It was such a great evening! Looking forward to the next one!',
      },
    }),
  ])

  // Create places
  const places = await Promise.all([
    prisma.place.create({
      data: {
        id: 'place-1',
        name: 'Café Mondegar',
        city: 'Mumbai',
        neighborhood: 'Colaba',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Mondegar',
        vibeTags: JSON.stringify(['Chill', 'Work', 'Coffee']),
        rating: 4.5,
      },
    }),
    prisma.place.create({
      data: {
        id: 'place-2',
        name: 'The Bombay Canteen',
        city: 'Mumbai',
        neighborhood: 'Lower Parel',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Canteen',
        vibeTags: JSON.stringify(['Date', 'Dinner', 'Loud']),
        rating: 4.8,
      },
    }),
    prisma.place.create({
      data: {
        id: 'place-3',
        name: 'Social',
        city: 'Mumbai',
        neighborhood: 'Bandra',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Social',
        vibeTags: JSON.stringify(['Loud', 'Party', 'Sunset']),
        rating: 4.2,
      },
    }),
    prisma.place.create({
      data: {
        id: 'place-4',
        name: 'Le15',
        city: 'Mumbai',
        neighborhood: 'Colaba',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Le15',
        vibeTags: JSON.stringify(['Chill', 'Date', 'Study']),
        rating: 4.6,
      },
    }),
  ])

  console.log(`Created ${places.length} places`)

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        userId: users[0].id,
        placeId: places[0].id,
        rating: 5,
        content: 'Great for work/coffee',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[1].id,
        placeId: places[0].id,
        rating: 4,
        content: 'Perfect vibe for studying',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[2].id,
        placeId: places[1].id,
        rating: 5,
        content: 'Amazing food and atmosphere',
      },
    }),
  ])

  // Link posts to places
  await prisma.post.update({
    where: { id: posts[0].id },
    data: { placeId: places[1].id },
  })

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

