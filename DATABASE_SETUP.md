# Database Setup Instructions for Vercel

## Problem
Your app uses SQLite (`file:./dev.db`) which doesn't work on Vercel's serverless environment.

## Solution: Set up Vercel Postgres

### Step 1: Create Vercel Postgres Database
1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Click on your "solosociety" project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose a name (e.g., "solosociety-db")
7. Select a region close to your users
8. Click "Create"

### Step 2: Connect Database to Project
1. After creating, Vercel will show you environment variables
2. Click "Connect to Project"
3. Select your "solosociety" project
4. Vercel will automatically add these environment variables:
   - POSTGRES_URL
   - POSTGRES_PRISMA_URL
   - POSTGRES_URL_NON_POOLING
   - And others...

### Step 3: Update Your Code (I'll do this for you)
I'll update:
- `prisma/schema.prisma` to use PostgreSQL
- `.env` file for local development
- Add migration files

### Step 4: Run Migrations
After I update the code, you'll need to:
```bash
npx prisma migrate dev --name init
npx prisma generate
git add -A
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push
```

## Alternative: Use Neon (Free PostgreSQL)
If you prefer not to use Vercel Postgres:
1. Go to https://neon.tech
2. Sign up for free
3. Create a new project
4. Copy the connection string
5. Add it to Vercel environment variables as `DATABASE_URL`

Let me know which option you prefer, and I'll help you set it up!
