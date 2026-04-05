# StayHere — Hotel Booking Platform

A full-stack hotel booking web application with three independently deployed apps: a customer-facing frontend, a hotel owner dashboard, and a separate admin panel. Users can discover hotels, book rooms, and manage trips. Hotel owners can list and manage their properties after admin approval. Admins have full control over the entire platform.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [How It Works — Full Flow](#how-it-works--full-flow)
- [User Roles](#user-roles)
- [Features](#features)
- [Backend API Reference](#backend-api-reference)
- [Database Models](#database-models)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Deployment (Vercel)](#deployment-vercel)
- [Key Design Decisions](#key-design-decisions)

---

## Project Structure

```
StayHere/
├── Backend/          → Express.js REST API (deployed on Vercel)
├── Frontend/         → Customer-facing React app (deployed on Vercel)
└── Admin/            → Admin panel React app (deployed on Vercel, separately)
```

All three are independent deployments. The Frontend and Admin both talk to the same Backend API.

---

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Express.js v5 | HTTP server and routing |
| MongoDB + Mongoose | Database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| nodemailer | Email sending via Gmail SMTP |
| cloudinary | Image storage and CDN |
| multer | File upload handling (temp disk storage) |
| stripe | Payment processing |
| dotenv | Environment variable loading |
| cors | Cross-origin request handling |

### Frontend & Admin
| Package | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP requests to backend |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| Recharts | Charts in admin dashboard |

---

## How It Works — Full Flow

### 1. Customer Registration & Login

1. User visits `/register`, fills name/email/password
2. Backend creates account with `isVerified: false`, generates a 6-digit OTP, sends it to their email via Gmail SMTP
3. Frontend switches to OTP input screen showing their email
4. User enters OTP → backend verifies it, marks `isVerified: true`, returns a JWT token
5. User is automatically logged in — token and user object saved to `localStorage`
6. Login (`/login`) is straightforward — email + password only, no OTP required
7. Old accounts in the database (created before the verification feature) are allowed to log in freely

### 2. Browsing Hotels & Rooms

1. On app load, `AppContext` fetches all available rooms from `/api/rooms`
2. Only rooms from **admin-approved hotels** are returned (backend filters using Mongoose `populate` with `match: { isApproved: true }`)
3. Homepage shows recommended hotels, featured destinations, exclusive offers
4. `/rooms` page has filter sidebar (room type, price range) and sort options
5. Clicking a room opens `/rooms/:id` with full details, image gallery, amenities, reviews, and booking form

### 3. Booking a Room

1. User selects check-in date, check-out date, and number of guests on the room detail page
2. Clicking "Check Availability" calls `/api/bookings/check-availability` — backend queries for overlapping bookings in that date range (excluding cancelled ones)
3. If available, button changes to "Book Now"
4. Clicking "Book Now" creates a booking with status `pending` and `isPaid: false`
5. Backend calculates total price (price per night × number of nights) and sends a confirmation email
6. User is redirected to `/my-bookings`

### 4. Stripe Payment

1. On My Bookings page, unpaid bookings show a "Pay Now" button
2. Clicking it calls `/api/bookings/stripe-payment` — backend creates a Stripe Checkout session with the booking amount in paise (INR × 100)
3. User is redirected to Stripe's hosted checkout page
4. On success, Stripe redirects to `/loader/my-bookings` (a brief loading page)
5. Stripe also fires a `payment_intent.succeeded` webhook to `/api/stripe`
6. Backend verifies the webhook signature, finds the booking ID from session metadata, and marks `isPaid: true` with `paymentMethod: "Stripe"`

### 5. Hotel Owner Registration Flow

This is the most complex flow in the project:

1. Any logged-in user clicks "List Your Hotel" in the navbar
2. They fill the hotel registration form (name, address, city, 10-digit contact number)
3. Backend creates the hotel with `isApproved: false` — the user's role stays `user`
4. Navbar now shows "⏳ Approval Pending" (non-clickable) instead of "List Your Hotel"
5. If they navigate to `/owner`, they see a pending approval screen with a clock icon
6. Admin logs into the admin panel, sees the hotel in the Hotels page with a "Pending" badge
7. Admin clicks "Approve" → backend sets `isApproved: true` AND upgrades owner's role to `hotelOwner`
8. Owner's navbar now shows "Dashboard" — clicking it opens the full owner dashboard
9. If admin clicks "Revoke" → `isApproved: false`, owner role back to `user`
10. If admin clicks "Delete" → all rooms of that hotel are deleted first, then the hotel, and owner role reverts to `user`

### 6. Hotel Owner Dashboard

Once approved, the owner can:
- View total bookings and revenue on the Dashboard
- Add rooms with up to 4 images (compressed client-side using Canvas API before upload)
- Manage room listings — toggle availability, edit details, delete rooms

### 7. Admin Panel

Completely separate React app at a different URL. Admin accounts are created with a secret key (`Pushpendra@2004`) to prevent unauthorized registrations.

Admin can manage:
- **Dashboard** — platform-wide stats with monthly booking chart
- **Users** — view and delete regular users
- **Hotel Owners** — view all approved owners with their hotel
- **Hotels** — approve/revoke/delete hotels
- **Rooms** — view all rooms across all hotels
- **Bookings** — full booking history
- **Newsletter** — all email subscribers
- **Contacts** — inbox of messages from the FAQ contact form

### 8. Contact Form

1. User fills the contact form at the bottom of the FAQ page
2. Message is saved to the `Contact` collection in MongoDB
3. An email notification is sent to the admin email (non-blocking — if env vars are missing on the server, the message is still saved, only the email is skipped)
4. Admin sees the message in the Contacts inbox in the admin panel, can mark as read, reply, or delete

### 9. Dark Mode

Toggle in the navbar switches between light and dark mode. The preference is saved to `localStorage` and applied by adding/removing the `dark` class on `<html>`. Tailwind's `dark:` variants handle all the color changes across every component.

---

## User Roles

| Role | How you get it | What you can do |
|---|---|---|
| `user` | Default on registration | Browse, book rooms, write reviews, contact hotel |
| `hotelOwner` | Admin approves your hotel | Everything above + owner dashboard, add/manage rooms |
| `admin` | Register with secret key in Admin panel | Full platform control |

---

## Features

### Customer App
- Email OTP verification on registration
- JWT-based authentication with localStorage persistence
- Hotel and room browsing with filters and sorting
- Room availability checking before booking
- Stripe payment integration
- Pay at hotel option
- Booking cancellation
- Guest reviews and star ratings on rooms
- User profile management (name, photo, password)
- Recent searched cities tracking (last 3)
- Trip Mood page — hotel suggestions by vibe
- FAQ page with accordion UI and contact form
- Newsletter subscription
- Dark mode / Light mode toggle
- Fully responsive (mobile + desktop)

### Hotel Owner Dashboard
- Hotel registration with admin approval gate
- Pending approval screen while waiting
- Add rooms with up to 4 images (client-side compression)
- Room type selection (Single Bed, Double Bed, Luxury Bed, Family Suite)
- Amenities selection (Free Wifi, Free Breakfast, Room Service, Mountain View, Pool Access)
- Toggle room availability instantly
- Edit room details and images
- Delete rooms
- Dashboard with total bookings, revenue, and recent bookings table

### Admin Panel
- Separate deployment with its own auth
- Secret key gate on admin registration
- Platform stats dashboard with Recharts bar chart
- Approve / Revoke / Delete hotels
- Cascade delete — deleting a hotel removes all its rooms automatically
- Full user, owner, hotel, room, booking management
- Newsletter subscriber list
- Contact form inbox with read/unread status
- Email notification on new contact message

---

## Backend API Reference

Base URL: `https://your-backend.vercel.app`

All protected routes require: `Authorization: Bearer <token>`

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user, sends OTP email |
| POST | `/login` | No | Login, returns JWT |
| POST | `/verify-email` | No | Verify OTP, activates account, returns JWT |
| POST | `/resend-otp` | No | Resend verification OTP |
| POST | `/forgot-password` | No | Send password reset OTP |
| POST | `/reset-password` | No | Reset password with OTP |

### User — `/api/user`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get user data (role, hotel status, recent cities) |
| GET | `/profile` | Yes | Get profile details |
| PUT | `/profile` | Yes | Update name, photo, password |
| POST | `/store-recent-search` | Yes | Save a searched city |

### Hotels — `/api/hotels`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Register a hotel (creates with isApproved: false) |

### Rooms — `/api/rooms`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Get all available rooms (approved hotels only) |
| POST | `/` | Yes | Add a new room (with image upload) |
| GET | `/owner` | Yes | Get rooms for the logged-in owner's hotel |
| POST | `/toggle-availability` | Yes | Toggle room availability |
| PUT | `/:roomId` | Yes | Update room details and images |
| DELETE | `/:roomId` | Yes | Delete a room |

### Bookings — `/api/bookings`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/check-availability` | No | Check if room is available for dates |
| POST | `/book` | Yes | Create a booking |
| GET | `/user` | Yes | Get logged-in user's bookings |
| GET | `/hotel` | Yes | Get bookings for owner's hotel |
| POST | `/cancel` | Yes | Cancel a booking |
| POST | `/stripe-payment` | Yes | Create Stripe checkout session |

### Reviews — `/api/reviews`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Submit a review |
| GET | `/room/:roomId` | No | Get reviews for a room |
| GET | `/hotel/:hotelId` | No | Get reviews for a hotel |

### Newsletter — `/api/newsletter`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/subscribe` | No | Subscribe to newsletter |

### Stripe Webhook — `/api/stripe`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Stripe signature | Handle payment_intent.succeeded |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No (secret key required) | Register admin account |
| POST | `/login` | No | Admin login |
| POST | `/contact` | No | Submit contact form message |
| GET | `/dashboard` | Admin | Platform stats |
| GET | `/users` | Admin | All regular users |
| GET | `/owners` | Admin | All hotel owners |
| GET | `/hotels` | Admin | All hotels with room count and owner |
| GET | `/rooms` | Admin | All rooms |
| GET | `/bookings` | Admin | All bookings |
| GET | `/newsletter` | Admin | All subscribers |
| GET | `/contacts` | Admin | All contact messages |
| PATCH | `/hotels/:id/approve` | Admin | Approve hotel + upgrade owner role |
| PATCH | `/hotels/:id/reject` | Admin | Reject hotel + downgrade owner role |
| DELETE | `/hotels/:id` | Admin | Delete hotel + all rooms + downgrade owner |
| DELETE | `/users/:id` | Admin | Delete a user |
| PATCH | `/contacts/:id/read` | Admin | Mark contact as read |
| DELETE | `/contacts/:id` | Admin | Delete contact message |

---

## Database Models

### User
```
name          String (required)
email         String (unique, lowercase)
password      String (bcrypt hashed, min 6 chars)
role          Enum: "user" | "hotelOwner"  (default: "user")
image         String (Cloudinary URL)
isVerified    Boolean (default: false)
verifyOtp     String
verifyOtpExpiry  Number (timestamp, 24hr expiry)
resetOtp      String
resetOtpExpiry   Number (timestamp, 15min expiry)
recentSearchedCities  [String] (max 3, rolling)
```

### Hotel
```
name       String (required)
address    String (required)
contact    String (required, 10 digits)
city       String (required)
owner      ObjectId → User (required)
isApproved Boolean (default: false)
```

### Room
```
hotel          String → Hotel (required)
roomType       String (Single Bed | Double Bed | Luxury Bed | Family Suite)
pricePerNight  Number (required)
amenities      Array of strings
images         [String] (Cloudinary URLs)
isAvailable    Boolean (default: true)
```

### Booking
```
user           String → User
room           String → Room
hotel          ObjectId → Hotel
checkInDate    Date
checkOutDate   Date
totalPrice     Number
guests         Number
status         Enum: "pending" | "confirmed" | "cancelled"
paymentMethod  String (default: "Pay At Hotel")
isPaid         Boolean (default: false)
```

### Review
```
user     String → User
hotel    ObjectId → Hotel
room     String → Room
rating   Number (1–5)
comment  String
```

### Admin
```
name      String (required)
email     String (unique)
password  String (bcrypt hashed)
```

### Newsletter
```
email  String (unique, lowercase)
```

### Contact
```
name     String
email    String
subject  String
message  String
isRead   Boolean (default: false)
```

### Offer
```
hotel               ObjectId → Hotel
room                String → Room
title               String
description         String
discountPercentage  Number (0–100)
validFrom           Date
validUntil          Date
isActive            Boolean (default: true)
```

---

## Environment Variables

### Backend (`Backend/.env`)
```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hotel-booking

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer (Gmail SMTP)
SENDER_EMAIL=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Currency
CURRENCY=₹

# Frontend URL (for CORS / redirects)
FRONTEND_URL=https://your-frontend.vercel.app

# Admin
ADMIN_SECRET_KEY=YourSecretKey
ADMIN_EMAIL=admin@gmail.com
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords. Generate one for "Mail". Use that as `SMTP_PASS`, not your actual Gmail password.

### Frontend (`Frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=₹
```

### Admin (`Admin/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000
```

> For production, set `VITE_BACKEND_URL` to your deployed backend URL in Vercel's environment variable settings for each project.

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Stripe account
- Gmail account with App Password enabled

### 1. Clone the repository
```bash
git clone https://github.com/your-username/stayhere.git
cd stayhere
```

### 2. Setup Backend
```bash
cd Backend
npm install
```
Create `Backend/.env` with all variables from the section above, then:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
```
Create `Frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=₹
```
```bash
npm run dev
# Runs on http://localhost:5173
```

### 4. Setup Admin Panel
```bash
cd Admin
npm install
```
Create `Admin/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```
```bash
npm run dev
# Runs on http://localhost:5174
```

### 5. Create your first Admin account
Open the Admin panel at `http://localhost:5174`, go to Register, and enter the secret key from your `ADMIN_SECRET_KEY` env variable.

### 6. Stripe Webhook (local testing)
Install the Stripe CLI and run:
```bash
stripe listen --forward-to localhost:5000/api/stripe
```
Copy the webhook signing secret it gives you and set it as `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## Deployment (Vercel)

All three apps are deployed separately on Vercel.

### Backend
The `Backend/vercel.json` is already configured:
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```
1. Push `Backend/` to a GitHub repo (or use the monorepo with root directory set to `Backend`)
2. Import into Vercel, set root directory to `Backend`
3. Add all environment variables from `Backend/.env` in Vercel's project settings
4. Deploy

### Frontend
1. Import into Vercel, set root directory to `Frontend`
2. Add environment variables:
   - `VITE_BACKEND_URL` = your deployed backend URL
   - `VITE_CURRENCY` = ₹
3. Deploy

### Admin Panel
1. Import into Vercel, set root directory to `Admin`
2. Add environment variable:
   - `VITE_BACKEND_URL` = your deployed backend URL
3. Deploy

> **Important**: After deploying, update `FRONTEND_URL` in your Backend's Vercel environment variables to point to your live frontend URL.

---

## Key Design Decisions

### Serverless-friendly Backend
MongoDB and Cloudinary connections are initialized lazily on the first request, not at startup. A `readyState` check prevents reconnecting on warm function instances. This is required for Vercel's serverless Node.js runtime.

### Hotel Approval Gate
Hotels start with `isApproved: false`. The owner's role stays `user` until admin approves. This prevents anyone from self-promoting to `hotelOwner`. Only approved hotels appear on the frontend — enforced at the database query level using Mongoose `populate` with `match`.

### JWT Strategy
Two middleware variants exist:
- `protect` — lightweight, just decodes the token. Used for routes that only need the user ID
- `protectUserData` — does a full DB lookup to get the live user document. Used for routes that read/write user fields

Admin tokens have `isAdmin: true` baked into the payload. `protectAdmin` middleware checks this flag — admins and users share the same `JWT_SECRET` but have different payload shapes.

### Client-side Image Compression
Before uploading room images, the frontend uses the Canvas API to resize images to max 1920×1080 and compress to 70% JPEG quality. This keeps uploads well within Vercel's 50MB request body limit and speeds up Cloudinary uploads.

### Non-blocking Email
Contact form email notifications use fire-and-forget (`.catch()` instead of `await`). The contact message is always saved to the database first. If `ADMIN_EMAIL` or `SENDER_EMAIL` env vars are missing (common on fresh deployments), the form still succeeds — only the email is skipped silently.

### Cascade Delete
When admin deletes a hotel, `Room.deleteMany({ hotel: hotelId })` runs before `Hotel.findByIdAndDelete()`. This keeps the database clean — no orphaned room documents.

### Owner Status in AppContext
`isOwner`, `hotelApproved`, and `hasPendingHotel` are all initialized from `localStorage` for instant UI rendering, then verified by a `fetchUser` API call on mount. This prevents flicker while also ensuring the UI always reflects the true server state. All three flags are cleared from `localStorage` on logout.
