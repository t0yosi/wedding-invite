# Wedding Invitation Application

A beautiful, full-stack Next.js wedding invitation application with RSVP management, guest tracking, and personalized invitation links.

## Features

- **Personalized Invitations**: Each guest gets a unique invitation URL
- **RSVP System**: Guests can accept/decline with meal preferences
- **Plus-One Support**: Allow specific guests to bring a plus-one
- **Event Schedule**: Display timeline of wedding events
- **Photo Gallery**: Showcase engagement or pre-wedding photos
- **Admin Dashboard**: Manage guests and view RSVP statistics
- **Real-time Updates**: See guest responses instantly
- **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (free tier)

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup Instructions

1. **Clone or navigate to the project**
   ```bash
   cd wedding-invite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Add your configuration:
   ```env
   # Set a secure admin password
   ADMIN_PASSWORD=your-secure-password-here

   # For local development
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### Step 2: Deploy the Project

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy"

### Step 3: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Choose a database name (e.g., `wedding-db`)
5. Click **Create**
6. Vercel will automatically add database environment variables to your project

### Step 4: Configure Environment Variables

1. Go to your project **Settings** → **Environment Variables**
2. Add the following variables:

   ```
   ADMIN_PASSWORD=your-secure-admin-password
   NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app
   ```

3. Click **Save**
4. Redeploy the project for changes to take effect

### Step 5: Initialize the Database

1. Once deployed, visit: `https://your-site.vercel.app/api/init`
2. This will create the necessary database tables
3. You should see: `{"message":"Database initialized successfully"}`

## Usage Guide

### Admin Dashboard

1. Visit `https://your-site.vercel.app/admin`
2. Enter the admin password you set in environment variables
3. Add guests with their name, email, and optional phone
4. Check "Allow Plus One" if the guest can bring someone
5. Copy the unique invitation link and send it to the guest

### Guest Experience

1. Guest receives their unique invitation link
2. They see a personalized invitation with:
   - Event details and schedule
   - Photo gallery
   - RSVP form
3. Guest fills out:
   - Attendance confirmation
   - Meal preference
   - Plus-one details (if allowed)
   - Optional message
4. Confirmation is saved and visible in admin dashboard

### Viewing Statistics

The admin dashboard shows:
- Total guests invited
- Number attending
- Number declined
- Pending responses
- Total plus-ones

## Customization

### Update Wedding Details

Edit [app/invite/[token]/page.tsx](app/invite/[token]/page.tsx):

```typescript
<h1 className="text-5xl md:text-6xl font-serif text-primary">
  Your Names Here
</h1>
<p className="font-medium">Your Wedding Date</p>
<p className="text-gray-600">Your Venue Name</p>
<p className="text-gray-600">Venue Address</p>
```

### Customize Event Schedule

Edit [components/EventSchedule.tsx](components/EventSchedule.tsx):

```typescript
const events = [
  {
    time: '3:00 PM',
    title: 'Your Event',
    description: 'Event description',
  },
  // Add more events...
];
```

### Add Photos to Gallery

1. Add your photos to the `public/photos/` folder
2. Name them: `photo1.jpg`, `photo2.jpg`, etc.
3. The gallery will automatically display them

### Change Color Scheme

Edit [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  primary: "#your-color-here", // Main accent color
  secondary: "#your-color-here", // Background color
},
```

### Customize Meal Options

Edit [components/RSVPForm.tsx](components/RSVPForm.tsx):

```typescript
<option value="your-option">Your Meal Option</option>
```

## API Endpoints

### Public Endpoints

- `GET /api/guests/[token]` - Get guest details by invitation token
- `PATCH /api/guests/[token]` - Update guest RSVP
- `GET /api/init` - Initialize database (run once)

### Admin Endpoints (require Authorization header)

- `GET /api/guests` - List all guests
- `POST /api/guests` - Create new guest
- `GET /api/stats` - Get RSVP statistics

Authorization header format: `Bearer YOUR_ADMIN_PASSWORD`

## Database Schema

```sql
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  token VARCHAR(100) NOT NULL UNIQUE,
  rsvp_status VARCHAR(20) DEFAULT 'pending',
  plus_one_allowed BOOLEAN DEFAULT false,
  plus_one_name VARCHAR(255),
  plus_one_attending BOOLEAN DEFAULT false,
  meal_preference VARCHAR(100),
  plus_one_meal_preference VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Database Connection Issues

If you see database errors:
1. Ensure Vercel Postgres is properly set up
2. Check that environment variables are configured
3. Visit `/api/init` to initialize tables

### Authentication Issues

If admin login fails:
1. Verify `ADMIN_PASSWORD` is set in environment variables
2. Redeploy after changing environment variables
3. Clear browser cache and try again

### Email Already Exists Error

Each email can only be used once. To add the same person again:
1. Use a different email, or
2. Delete the existing guest from the database

## Security Notes

- Admin password is required for all administrative actions
- Each guest invitation link is unique and non-guessable (16-character nanoid)
- Database credentials are managed securely by Vercel
- Never commit `.env.local` to version control

## Free Tier Limits

### Vercel
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### Vercel Postgres
- 256 MB storage
- 60 hours compute time/month
- Sufficient for 500+ guests

## Support

For issues or questions:
1. Check this README
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Check [Vercel documentation](https://vercel.com/docs)

## License

This project is free to use for personal wedding invitations.

---

**Congratulations on your wedding!** 🎉💍
