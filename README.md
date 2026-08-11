# GearUp Frontend

GearUp is a rental marketplace for outdoor and sports equipment. This project delivers the frontend foundation using Next.js App Router with a role-aware journey for customers, providers, and admins.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- Sonner
- next-themes
- Stripe-ready payment flow

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Add environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=https://gearup-igqw.onrender.com
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key_here
   ```
3. Run the app:
   ```bash
   pnpm run dev
   ```

## Core routes

- `/` — landing page
- `/gear` — gear catalog
- `/gear/[id]` — gear details
- `/about` — about the platform
- `/contact` — contact page
- `/login` — login
- `/register` — registration
- `/dashboard` — customer dashboard
- `/provider` — provider dashboard
- `/admin` — admin dashboard
- `/payment/success` — successful checkout
- `/payment/cancel` — canceled checkout

## Project highlights

- App Router architecture
- Service layer abstraction for backend calls
- Query caching via TanStack Query
- Auth state persistence with Zustand
- Role-aware middleware guard
- Toast notifications and error states
- Responsive UI with shadcn-inspired components

## API integration

See [API_INTEGRATION.md](API_INTEGRATION.md) for endpoint-to-component mapping.

## Testing & seeded accounts

Ready-made accounts for every role (admin, customer, provider) come seeded with
the database — all use the same password: `GearUp@2026!`.

See **[TESTING.md](TESTING.md)** for the full account list, seeded gear
inventory, seeded rental orders, and a role-by-role testing checklist.

