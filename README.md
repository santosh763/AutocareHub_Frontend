# 🔧 AutoCare Hub — Frontend

A modern, production-grade vehicle service booking platform built with React + TypeScript + Tailwind CSS.

---

## 🚀 Tech Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Framework        | React 18 + TypeScript                           |
| Styling          | Tailwind CSS v3 (custom design tokens)          |
| State Management | Redux Toolkit (auth + bookings slices)          |
| Routing          | React Router v6 (protected + role-based routes) |
| HTTP Client      | Axios (JWT interceptors + global error handler) |
| Animations       | Framer Motion                                   |
| Notifications    | React Hot Toast                                 |
| Build Tool       | Vite                                            |

---

## 📁 Folder Structure

```
src/
├── api/
│   ├── axios.ts           # Axios instance + interceptors
│   ├── authService.ts     # POST /api/auth/*
│   ├── vehicleService.ts  # CRUD /api/vehicles
│   ├── bookingService.ts  # CRUD /api/bookings
│   ├── paymentService.ts  # POST /api/payments/*
│   └── adminService.ts    # GET/PUT /api/admin/*
│
├── store/
│   ├── index.ts           # Redux store
│   └── slices/
│       ├── authSlice.ts   # Auth state (user, token, loading)
│       └── bookingsSlice.ts
│
├── pages/
│   ├── Landing.tsx        # Public landing page
│   ├── Auth.tsx           # Login + Register (split-screen layout)
│   ├── Dashboard.tsx      # User dashboard (stats, vehicles, bookings)
│   ├── Vehicles.tsx       # Vehicle CRUD with modal
│   ├── BookService.tsx    # 4-step booking wizard
│   ├── Payment.tsx        # Payment + success state
│   ├── BookingHistory.tsx # Filterable bookings list
│   └── admin/
│       └── AdminDashboard.tsx  # Admin booking management
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx     # primary / secondary / ghost / danger
│   │   ├── Input.tsx      # with label, error, icon, password toggle
│   │   ├── Modal.tsx      # animated with backdrop
│   │   ├── Card.tsx       # Card + StatCard
│   │   └── Badge.tsx      # StatusBadge + Skeleton components
│   └── layout/
│       ├── Sidebar.tsx         # Responsive sidebar + mobile drawer
│       └── ProtectedRoute.tsx  # Auth guard + AdminRoute
│
├── hooks/
│   ├── useAppDispatch.ts  # Typed Redux hooks
│   ├── useAuth.ts         # Auth state + logout helper
│   └── useVehicles.ts     # Vehicle CRUD local state
│
└── types/
    └── index.ts           # All TypeScript interfaces + constants
```

---

## ⚙️ Setup

```bash
# Install dependencies
npm install

# Start dev server (proxy → localhost:5000)
npm run dev

# Build for production
npm run build
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000`.

---

## 🔌 API Mapping

| Frontend Page        | API Endpoint                              |
|----------------------|-------------------------------------------|
| Login / Register     | POST `/api/auth/login` · `/api/auth/register` |
| Dashboard            | GET `/api/auth/profile` · `/api/vehicles` · `/api/bookings` |
| Vehicles             | GET/POST/PUT/DELETE `/api/vehicles/:id`   |
| Book Service         | POST `/api/bookings`                      |
| Payment              | POST `/api/payments/create-order` + `/verify` |
| Booking History      | GET `/api/bookings`                       |
| Admin Dashboard      | GET `/api/admin/bookings`                 |
| Admin Status Update  | PUT `/api/admin/bookings/:id/status`      |

---

## 🔐 Auth Flow

1. User logs in → JWT stored in `localStorage` as `ach_token`
2. Axios interceptor attaches `Authorization: Bearer <token>` on every request
3. On 401 response → token cleared, user redirected to `/login`
4. Role-based routing: `admin` → `/admin`, `user` → `/dashboard`

---

## 🎨 Design System

**Colors**
- `brand-400` `#0F6E56` — Primary CTA, links
- `brand-300` `#1D9E75` — Hover states
- `brand-200` `#5DCAA5` — Focus rings, accents
- `brand-50`  `#E1F5EE` — Backgrounds, badges

**Typography**
- Display: `Syne` (headings, hero)
- Body: `DM Sans` (all UI text)
- Mono: `JetBrains Mono` (licence plates, IDs)

**Components**
- `Button` — 4 variants × 3 sizes, loading state, icons
- `Input` — floating label, error, icon slots, password toggle
- `Modal` — animated with `AnimatePresence`, keyboard-aware
- `StatusBadge` — color-coded per booking status
- `Skeleton` — shimmer animation for loading states
- `Card` / `StatCard` — hover-lift, shadow system

---

## 📱 Responsive

- **Mobile-first** Tailwind breakpoints
- Sidebar collapses to slide-in drawer on `< lg`
- All pages work on 375px+ screens
- Admin table falls back to card layout on mobile

---

## 🌙 Dark Mode

Automatically follows system preference (`prefers-color-scheme`). Tailwind `dark:` classes used throughout.

---

## ⚡ UX Features

- Skeleton loaders on all async data
- Optimistic updates in Admin status changes
- Toast notifications (success / error / warning)
- Framer Motion page + component animations
- Empty states on all list views
- Form validation with inline error messages
- Booking stepper with progress indicator
- Expandable booking detail rows

---

## 🔗 Backend Expected Response Shape

```json
// Standard success
{ "success": true, "data": { ... } }

// Auth
{ "token": "jwt...", "user": { "_id": "...", "name": "...", "email": "...", "role": "user" } }

// Paginated
{ "success": true, "data": [...], "total": 42 }
```

---

## 📦 Key Dependencies

```json
{
  "@reduxjs/toolkit": "^2.2.7",
  "axios": "^1.7.2",
  "framer-motion": "^11.3.28",
  "react-hot-toast": "^2.4.1",
  "react-router-dom": "^6.24.1",
  "date-fns": "^3.6.0"
}
```
