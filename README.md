# WhereAt - Dinner With Strangers

A mobile-first web app prototype for connecting strangers over curated dinner events.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite** (local dev DB)
- **Next Auth** (with mock phone OTP)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file for Next Auth configuration:
   
   **Option A - Use the setup script (Windows PowerShell):**
   ```powershell
   .\setup-env.ps1
   ```
   
   **Option B - Use the setup script (Mac/Linux):**
   ```bash
   chmod +x setup-env.sh
   ./setup-env.sh
   ```
   
   **Option C - Create manually:**
   Create a `.env.local` file in the root directory with:
   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```
   
   **Note:** This file is required for Next Auth to work properly.

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Seed the database with sample data:
```bash
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

This prototype uses **mock phone OTP authentication**:

1. On the login page, enter any phone number (e.g., `+91 1234567890`)
2. Click "Send OTP"
3. Enter the hardcoded OTP: **`000000`** (six zeros)
4. You'll be authenticated and redirected to onboarding (if profile incomplete) or events page

**Note:** No actual SMS is sent. The OTP `000000` works for any phone number.

## Features

### 1. Authentication
- Mock phone OTP login (use `000000` for any phone)
- Session-based authentication

### 2. Profile & Onboarding
- First-time users are redirected to `/onboarding`
- Required fields: Name, City, 3 Interests
- Optional: Age
- Profile can be edited from `/profile`

### 3. Events
- **`/events`** - List of upcoming dinner events
- **`/events/[id]`** - Event details with booking option
- Shows available seats, location, date/time, price
- Displays "Who's going" with attendee avatars

### 4. Booking Flow
- Click "Book a seat" on any event
- Review booking summary
- Confirm booking (no actual payment processing)
- Booking success page with next steps

### 5. Feed
- **`/feed`** - Past events with photos and quotes
- Read-only feed showing community experiences

### 6. Navigation
- Mobile-first bottom navigation
- Home (Events), Feed, Profile

## Database Schema

- **User**: id, phone, createdAt
- **Profile**: id, userId, name, age, city, interests (JSON), timestamps
- **Event**: id, title, description, dateTime, locationName, locationAddress, maxSeats, price, imageUrl, status, createdBy
- **Booking**: id, userId, eventId, createdAt

## Project Structure

```
app/
  (auth)/
    login/          # Login page
  (main)/
    events/         # Events list
    events/[id]/    # Event detail
    events/[id]/book/    # Booking page
    events/[id]/success/ # Booking success
    feed/           # Past events feed
    profile/        # User profile
    onboarding/     # Profile setup
  api/
    auth/[...nextauth]/  # Next Auth API
    profile/        # Profile API
    bookings/       # Booking API
components/         # Reusable components
lib/                # Utilities (Prisma, Auth)
prisma/             # Prisma schema and seed
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Sample Data

The seed script creates:
- 5 sample users with profiles
- 5 events (3 upcoming, 2 past)
- Several bookings linking users to events

## Notes

- This is a **Phase 1 prototype**, not production-ready
- No actual payment processing
- No real SMS/OTP integration
- Optimized for speed and clarity
- Mobile-first design with Tailwind CSS

## Troubleshooting

If you encounter issues:

1. **Database errors**: Run `npx prisma migrate reset` to reset and reseed
2. **Auth issues**: Clear cookies and try logging in again
3. **Build errors**: Delete `.next` folder and `node_modules`, then reinstall

## License

This is a prototype project.

<title>Solo Society</title>
<meta name="description" content="Solo Society - Dine, connect, and discover new people." />

