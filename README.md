# 🍔 Tasty Bites — Food Delivery Web Application

A complete, mobile-first food ordering and delivery website. Customers browse
the menu, add items to a cart, and check out in a few taps — their order is
saved to the database and the details are sent straight to the restaurant's
WhatsApp. Restaurant staff manage the menu and incoming orders from a simple
admin dashboard.

```
Open → Select Food → Add to Cart → Enter Details → Place Order → Order Details Sent to Admin WhatsApp
```

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons
**Backend:** Node.js, Express.js, REST API
**Database:** MongoDB with Mongoose
**Auth:** JWT + bcrypt password hashing (admin login)
**Notifications:** WhatsApp order details (official Cloud API if configured, otherwise a safe pre-filled `wa.me` link)

## Project Structure

```
food-delivery-app/
├── client/                  React frontend (Vite)
│   ├── src/
│   │   ├── components/      Reusable UI: Navbar, BottomNav, FoodCard, AdminLayout...
│   │   ├── pages/            Home, Cart, Checkout, Order Tracking, Admin pages...
│   │   ├── context/          Cart, Auth, Language (English/Tamil) state
│   │   ├── i18n/              Translation dictionary
│   │   └── services/          Axios API client
│   └── package.json
│
├── server/                  Express backend
│   ├── controllers/          Request handlers (auth, food, orders)
│   ├── models/                Mongoose schemas: User, Food, Order
│   ├── routes/                 REST API route definitions
│   ├── middleware/             JWT auth, error handling
│   ├── services/                WhatsApp notification logic
│   ├── seed/                     Demo food data + demo admin account
│   └── server.js
│
├── .env.example              Reference copy of every environment variable
└── README.md
```

## Features

- 📱 Fully responsive — mobile bottom nav, desktop top nav
- 🔎 Instant search + category filters (Burgers, Pizza, Chicken, Rice, Drinks, Snacks, Desserts)
- 🛒 Persistent cart (saved in the browser) with quantity controls
- 📝 Simple checkout — name, phone, address, delivery type, payment method
- 💬 Order details sent to the restaurant's WhatsApp the moment an order is placed
- 📦 Order tracking with a clear status timeline
- 🔐 Secure admin login (JWT + hashed passwords)
- 📊 Admin dashboard with live order & revenue stats
- 🍽️ Admin food management — add, edit, delete, mark available/unavailable
- 📋 Admin order management — filter by status, update status, message or call the customer directly from WhatsApp
- 🌐 English / Tamil language toggle, built to be extended with more languages
- ♿ Large buttons, readable text, and simple wording — built for first-time smartphone users

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A MongoDB database — either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB install

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ADMIN_WHATSAPP_NUMBER` — the restaurant's WhatsApp number, digits only, with country code (e.g. `919876543210`)
- `RESTAURANT_NAME` — shown in the WhatsApp message
- Leave `WHATSAPP_CLOUD_API_TOKEN` and `WHATSAPP_CLOUD_PHONE_NUMBER_ID` blank unless you have an approved Meta WhatsApp Cloud API account (see below)

Seed the database with demo food items and a demo admin login:

```bash
npm run seed
```

This creates:
- 14 demo food items across every category
- An admin account — **admin@restaurant.com / admin123**

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend Setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The website runs at `http://localhost:5173`.

### 4. Try it out

- Open `http://localhost:5173` and place a test order as a customer.
- Go to `http://localhost:5173/admin/login` and sign in with the demo admin account to see the dashboard, manage food items, and manage orders.

## How the WhatsApp Notification Works

No WhatsApp credentials are hardcoded anywhere in the code — everything comes
from environment variables.

1. **Official method (optional):** if you have an approved [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) account, set `WHATSAPP_CLOUD_API_TOKEN` and `WHATSAPP_CLOUD_PHONE_NUMBER_ID` in `server/.env`. New orders are then sent to `ADMIN_WHATSAPP_NUMBER` automatically.
2. **Fallback (works with zero setup):** if those aren't configured, the app builds a `wa.me` link with the full order pre-filled. The customer sees a **"Send Order to Restaurant on WhatsApp"** button on the confirmation screen, and the admin has a **"WhatsApp Customer"** button on every order to message the customer back — both just open WhatsApp with the message ready to send.

## Environment Variables

See `.env.example` at the project root for the full list, or the `.env.example` file inside `client/` and `server/` individually.

## Deployment

**Backend** — deploy `server/` to a Node host (Render, Railway, Fly.io, an EC2/VM, etc.). Set all the variables from `server/.env.example` in your host's environment settings, and point `MONGODB_URI` at your production database (MongoDB Atlas works well). Set `CLIENT_URL` to your deployed frontend's URL so CORS allows it.

**Frontend** — deploy `client/` to a static host (Vercel, Netlify, Cloudflare Pages). Set `VITE_API_URL` to your deployed backend's URL, e.g. `https://your-api.onrender.com/api`, then run `npm run build` (or let the host build it) and deploy the `dist/` folder.

**Database** — use a MongoDB Atlas free-tier cluster for production; add your deployed backend's IP (or `0.0.0.0/0` for platforms with dynamic IPs) to the Atlas network access list.

After deploying, run the seed script once against your production database (`npm run seed` with `MONGODB_URI` pointed at production) to create the first admin account and starter menu — then log in and change the admin password by re-registering or updating the record directly, since there's no in-app "change password" screen yet.

## Notes

- Prices, food availability, and order totals are always recalculated on the server from the database — the app never trusts prices sent from the browser.
- Customer-facing error messages are always plain and friendly (e.g. "Please enter your mobile number.") — technical errors are logged on the server only.
- The Tamil translations cover the core customer flow; add more keys to `client/src/i18n/translations.js` to extend language coverage.
