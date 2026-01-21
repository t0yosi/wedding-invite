# Project Structure

```
wedding-invite/
├── app/
│   ├── admin/
│   │   └── page.tsx                 # Admin dashboard with guest management
│   ├── api/
│   │   ├── guests/
│   │   │   ├── [token]/
│   │   │   │   └── route.ts        # Get/update specific guest by token
│   │   │   └── route.ts            # List all guests, create new guest
│   │   ├── init/
│   │   │   └── route.ts            # Initialize database tables
│   │   └── stats/
│   │       └── route.ts            # Get RSVP statistics
│   ├── invite/
│   │   └── [token]/
│   │       └── page.tsx            # Personalized guest invitation page
│   ├── globals.css                  # Global styles and Tailwind directives
│   ├── layout.tsx                   # Root layout component
│   └── page.tsx                     # Landing page
│
├── components/
│   ├── AdminGuestList.tsx           # Guest list table for admin
│   ├── EventSchedule.tsx            # Wedding event timeline
│   ├── PhotoGallery.tsx             # Photo gallery component
│   └── RSVPForm.tsx                 # RSVP form with meal preferences
│
├── lib/
│   └── db.ts                        # Database functions and schema
│
├── public/
│   └── photos/
│       └── .gitkeep                 # Placeholder for wedding photos
│
├── .env.example                     # Environment variables template
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Git ignore rules
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS configuration
├── PROJECT_STRUCTURE.md             # This file
├── README.md                        # Detailed documentation
├── SETUP.md                         # Quick setup guide
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── vercel.json                      # Vercel deployment configuration
```

## Key Files Explained

### Application Pages

- **`app/page.tsx`** - Landing page with wedding announcement
- **`app/invite/[token]/page.tsx`** - Personalized invitation page for each guest
- **`app/admin/page.tsx`** - Admin dashboard for managing guests and viewing RSVPs

### API Routes

- **`/api/init`** - Initializes database (run once after deployment)
- **`/api/guests`** - CRUD operations for guests (admin only)
- **`/api/guests/[token]`** - Get/update specific guest (public)
- **`/api/stats`** - Get RSVP statistics (admin only)

### Components

- **`RSVPForm.tsx`** - Handles guest responses with meal preferences and plus-one
- **`EventSchedule.tsx`** - Displays wedding day timeline
- **`PhotoGallery.tsx`** - Shows engagement/pre-wedding photos
- **`AdminGuestList.tsx`** - Displays all guests in a sortable table

### Database

- **`lib/db.ts`** - All database operations using Vercel Postgres
  - Guest creation and retrieval
  - RSVP updates
  - Statistics aggregation

## Page Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/admin` | Admin dashboard | Password protected |
| `/invite/[token]` | Guest invitation | Token required |
| `/api/init` | Database setup | Public (one-time) |
| `/api/guests` | Guest management | Admin only |
| `/api/guests/[token]` | Guest details | Token required |
| `/api/stats` | RSVP statistics | Admin only |

## Data Flow

### Adding a Guest (Admin)
1. Admin logs in at `/admin`
2. Fills out guest form
3. POST to `/api/guests`
4. Unique token generated
5. Guest record created in database
6. Invitation URL returned

### Guest RSVP
1. Guest visits `/invite/[token]`
2. GET from `/api/guests/[token]`
3. Guest details loaded and displayed
4. Guest fills RSVP form
5. PATCH to `/api/guests/[token]`
6. Database updated
7. Confirmation shown

### Viewing Statistics (Admin)
1. Admin dashboard loads
2. GET from `/api/stats`
3. Aggregated data displayed
4. Real-time updates available

## Environment Variables

Required in `.env.local` or Vercel:

```env
# Database (auto-set by Vercel Postgres)
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE

# Manual configuration
ADMIN_PASSWORD              # Admin dashboard password
NEXT_PUBLIC_BASE_URL        # Site URL for invitation links
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres (PostgreSQL)
- **Hosting**: Vercel
- **ID Generation**: nanoid

## Features Summary

✅ Personalized invitation links
✅ RSVP management
✅ Plus-one support
✅ Meal preference tracking
✅ Event schedule display
✅ Photo gallery
✅ Admin dashboard
✅ Real-time statistics
✅ Mobile responsive
✅ Password-protected admin
✅ Free hosting on Vercel

## Next Steps After Setup

1. Customize wedding details in invitation page
2. Update event schedule
3. Add photos to gallery
4. Change color scheme (optional)
5. Test locally
6. Deploy to Vercel
7. Set up Postgres database
8. Initialize database via `/api/init`
9. Start adding guests
10. Send invitation links
