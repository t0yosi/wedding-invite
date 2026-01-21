# Quick Setup Guide

Follow these steps to get your wedding invitation site up and running.

## 1. Install Node.js

If you don't have Node.js installed:
1. Visit [nodejs.org](https://nodejs.org)
2. Download and install the LTS version
3. Verify installation: `node --version`

## 2. Install Dependencies

```bash
cd wedding-invite
npm install
```

## 3. Configure Environment Variables

Create `.env.local`:

```bash
ADMIN_PASSWORD=ChooseASecurePassword123!
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Test Locally

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 5. Deploy to Vercel

### A. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### B. Push to GitHub
```bash
git init
git add .
git commit -m "My wedding invitation"
# Create a new repo on GitHub, then:
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### C. Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click "Deploy"
4. Wait for deployment to complete

### D. Add Postgres Database
1. In Vercel project dashboard → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Name it `wedding-db` → Click **Create**
4. Database credentials are added automatically

### E. Set Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `ADMIN_PASSWORD`: Your secure password
   - `NEXT_PUBLIC_BASE_URL`: Your Vercel URL (e.g., `https://my-wedding.vercel.app`)
3. Click **Save**
4. Go to **Deployments** → Click ⋯ on latest → **Redeploy**

### F. Initialize Database
Visit: `https://your-site.vercel.app/api/init`

You should see: `{"message":"Database initialized successfully"}`

## 6. Customize Your Site

### Update Wedding Details
Edit `app/invite/[token]/page.tsx` (lines 50-60):
- Change names
- Update date
- Update venue
- Update address

### Update Event Schedule
Edit `components/EventSchedule.tsx`:
- Modify times and events

### Add Photos
1. Add photos to `public/photos/` folder
2. Name them: `photo1.jpg`, `photo2.jpg`, etc.

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: "#your-color",  // Main accent color
  secondary: "#your-color", // Background
},
```

## 7. Start Using

### Add Guests
1. Visit `https://your-site.vercel.app/admin`
2. Login with your admin password
3. Add guest name, email, phone (optional)
4. Check "Allow Plus One" if applicable
5. Click "Add Guest"
6. Copy the unique invitation link
7. Send link to guest via email/message

### Monitor RSVPs
- View real-time statistics in admin dashboard
- See who has responded
- Check meal preferences
- Export guest list

## Common Issues

### "Cannot find module" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection error
- Ensure Postgres is set up in Vercel
- Check environment variables are set
- Redeploy after changing env vars
- Visit `/api/init` to create tables

### Admin login not working
- Verify `ADMIN_PASSWORD` is set in Vercel
- Redeploy after adding env variable
- Clear browser cache

## Need Help?

1. Check `README.md` for detailed documentation
2. Visit [Next.js docs](https://nextjs.org/docs)
3. Visit [Vercel docs](https://vercel.com/docs)

---

**That's it! Your wedding invitation site is ready!** 💍✨
