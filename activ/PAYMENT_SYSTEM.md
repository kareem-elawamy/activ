# Manual Payment System — Active Academy

## How It Works

```
User books activity → uploads proof → admin reviews → approves/rejects → user sees status
```

## Quick Start

```bash
npm install
npm run dev
# Visit http://localhost:3000/ar
```

## Admin Access

URL: `http://localhost:3000/ar/admin-login`  
Default credentials: **admin** / **admin123**

To change, set in `.env.local`:
```
NEXT_PUBLIC_ADMIN_USERNAME=youradmin
NEXT_PUBLIC_ADMIN_PASSWORD=yourpassword
```

## Payment Flow (Step by Step)

### User Side
1. Go to `/ar/sports`
2. Click "احجز الآن" on any activity
3. **Step 1** — Fill in: Full Name, Age, National ID, Phone
4. **Step 2** — Choose payment method:
   - 🧾 **Receipt** — pay at academy, upload receipt photo
   - 📲 **InstaPay** — transfer to `active.academy@instapay`, upload screenshot
   - 📱 **E-Wallet** — transfer via Vodafone/Orange/Etisalat/WE, upload confirmation
5. **Step 3** — Upload proof image/PDF (max 5MB)
6. Submit → booking created with status "pending"

### Admin Side
1. Go to `/ar/admin` → "الحجوزات والمدفوعات" tab
2. See all bookings filtered by status (pending/approved/rejected)
3. Click any row to open the detail panel
4. View the uploaded proof image inline
5. Set the approved price (EGP)
6. Optionally set a hold date and add a note for the user
7. Click ✅ **موافقة** to approve or ❌ **رفض** to reject

### User Sees Result
- Visit `/ar/my-bookings` (also in Navbar as "حجوزاتي")
- See live status: ⏳ Under Review → ✅ Approved (with price + note) or ❌ Rejected

## Files Changed

| File | Change |
|------|--------|
| `lib/db.js` | NEW — JSON file database with /tmp fallback |
| `data/bookings.json` | NEW — persistent booking storage |
| `data/payments.json` | NEW — persistent payment storage |
| `app/api/bookings/route.js` | NEW — GET all / POST new booking |
| `app/api/bookings/[id]/route.js` | NEW — GET/PATCH/DELETE single booking |
| `app/api/upload/route.js` | NEW — file upload to public/uploads/ |
| `components/BookNowButton.tsx` | MODIFIED — 3-step manual payment popup |
| `app/[locale]/my-bookings/page.js` | NEW — user booking status page |
| `app/[locale]/admin/activities/BookingsTable.tsx` | MODIFIED — full admin approval panel |
| `app/[locale]/admin/activities/ManageContent.tsx` | MODIFIED — added price/description fields |
| `app/[locale]/admin/page.js` | MODIFIED — cleaner tabs, no NextAuth |
| `app/[locale]/admin-login/page.js` | MODIFIED — fixed: replaced NextAuth with localStorage auth |
| `components/Navbar.tsx` | MODIFIED — added "My Bookings" link |
| `messages/en.json` + `messages/ar.json` | MODIFIED — added nav.myBookings |
| `next.config.mjs` | MODIFIED — fixed proxy (only auth/complaints go to Express) |

## Bugs Fixed

1. **Admin login was broken** — used NextAuth but admin page checked localStorage (now consistent)
2. **params.id in dynamic route** — wasn't awaited (fixed for Next.js 14.2+)
3. **data/ directory permissions** — db.js now falls back to /tmp if not writable
4. **No "My Bookings" nav link** — users couldn't find their booking status
5. **my-bookings params** — fixed for Next.js App Router async params
6. **Upload directory** — auto-creates with /tmp fallback
