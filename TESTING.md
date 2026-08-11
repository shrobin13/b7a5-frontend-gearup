# 🧪 GearUp — Testing Guide & Seeded Accounts

> Everything a tester needs to explore GearUp: **ready-made accounts for every
> role (with passwords), seeded inventory, seeded orders, and what to verify.**

---

## 1. Deployed environments

| Environment | URL |
|---|---|
| Frontend (Next.js) | `https://b7a5-frontend-gearup-1.onrender.com` |
| Backend API (Express) | `https://gearup-igqw.onrender.com` |

For **local development**, see [Setup](#7-local-setup) below.

---

## 2. Seeded accounts (roles + passwords)

The database ships with accounts for **all three roles**. Use them to sign in
without registering.

> 🔑 **Password for every account is the same:** `GearUp@2026!`

### 👑 Admin

| Name | Email | Password | Can do |
|---|---|---|---|
| GearUp Admin | `admin@gearup.dev` | `GearUp@2026!` | Manage users, gear, rentals, categories |

**Admin test areas (frontend):** `/admin`, `/admin/users`, `/admin/gear`,
`/admin/rentals`, `/admin/categories`.

**Admin test areas (API):**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id` | Activate/suspend a user |
| GET | `/api/admin/gear` | List all gear listings |
| DELETE | `/api/admin/gear/:id` | Delete any gear listing (admins only) |
| GET | `/api/admin/rentals` | List all rental orders |
| PATCH | `/api/admin/rentals/:id/cancel` | Cancel any placed rental (admins only) |

### 🛍️ Customers

| Name | Email | Password |
|---|---|---|
| Alex Carter | `alex.carter@gearup.dev` | `GearUp@2026!` |
| Sam Taylor | `sam.taylor@gearup.dev` | `GearUp@2026!` |

**What to test:** browse gear, place a rental order, pay (Stripe / SSLCommerz),
track order status, cancel a *placed* order, leave a review on returned gear,
manage profile. Frontend: `/dashboard`, `/dashboard/orders`,
`/dashboard/payments`, `/dashboard/profile`.

### 🏪 Providers

| Name | Email | Password |
|---|---|---|
| Summit Rentals | `summit.rentals@gearup.dev` | `GearUp@2026!` |
| Coastal Watersports | `coastal.watersports@gearup.dev` | `GearUp@2026!` |
| Urban Cycle Hub | `urban.cycle@gearup.dev` | `GearUp@2026!` |

**What to test:** add/edit/remove gear, manage stock, view incoming orders,
update order status. Frontend: `/provider`, `/provider/add-gear`,
`/provider/inventory`, `/provider/orders`.

---

## 3. Seeded categories

| Category | Description |
|---|---|
| Camping | Tents, sleeping bags, stoves, and camping essentials |
| Hiking | Trekking poles, backpacks, and hiking accessories |
| Cycling | Bikes, helmets, locks, and cycling gear |
| Water Sports | SUPs, kayaks, wetsuits, and water accessories |
| Fitness | Yoga mats, resistance bands, and workout accessories |

---

## 4. Seeded gear inventory (15 items)

Prices are **per day**.

### Summit Rentals
| Item | Brand | Price/day | Stock |
|---|---|---|---|
| Mountain Tent 2P | Big Agnes | $35 | 8 |
| Sleeping Bag -15°C | Marmot | $18 | 12 |
| Backpacking Stove | MSR | $8 | 20 |
| Trekking Poles (Pair) | Black Diamond | $6 | 15 |
| Headlamp 400lm | Petzl | $4 | 25 |

### Coastal Watersports
| Item | Brand | Price/day | Stock |
|---|---|---|---|
| Stand-Up Paddleboard | iRocker | $45 | 6 |
| Kayak - Sit-on-Top | Perception | $40 | 4 |
| Wetsuit 3/2mm | O'Neill | $15 | 10 |
| Snorkel Set | Cressi | $10 | 18 |
| Dry Bag 20L | Sea to Summit | $5 | 30 |

### Urban Cycle Hub
| Item | Brand | Price/day | Stock |
|---|---|---|---|
| Hybrid Bike | Trek | $30 | 10 |
| Road Bike Carbon | Specialized | $60 | 3 |
| Mountain Bike Full-Suspension | Giant | $55 | 5 |
| Helmet MIPS | Giro | $7 | 20 |
| Bike Lock U-Lock | Kryptonite | $3 | 25 |

> **Filtering the catalog (API):** `GET /api/gear` supports
> `?category=<name-or-id>`, `?brand=`, `?minPrice=`, `?maxPrice=`, and
> `?available=true|false`.

---

## 5. Seeded rental orders, payments & reviews

These pre-seed a realistic history so you can test every status.

| # | Customer | Status | Gear | Total | Payment |
|---|---|---|---|---|---|
| 1 | Alex Carter | `RETURNED` | Mountain Tent 2P + Trekking Poles | $164 | Stripe · COMPLETED (`pi_seed_0001`) · 5★ review |
| 2 | Alex Carter | `PICKED_UP` | Hybrid Bike | $150 | Stripe · COMPLETED (`pi_seed_0002`) |
| 3 | Alex Carter | `CONFIRMED` | Stand-Up Paddleboard | $135 | SSLCommerz · PENDING (`ssl_seed_0003`) |
| 4 | Sam Taylor | `CONFIRMED` | Kayak - Sit-on-Top | $120 | Stripe · PENDING (`pi_seed_0004`) |

**Rental status flow:** `PLACED` → `CONFIRMED` → `PAID` → `PICKED_UP` → `RETURNED`,
with `CANCELLED` reachable from `PLACED` (by customer or admin).

> **Note:** No seeded order starts in `PLACED`. To test cancellation, log in as
> a customer (e.g. `alex.carter@gearup.dev`), place a new rental order, and
> cancel it — or cancel it from the admin rentals page.

---

## 6. Authentication & API notes

- **Login:** `POST /api/auth/login` with `{ "email", "password" }`.
- The frontend proxies API calls through its own routes (`/api/backend/...`) and
  manages session cookies; hitting the backend directly requires an
  `Authorization: Bearer <accessToken>` header.
- **Logout:** `POST /api/auth/logout` (authenticated) — returns 200 and clears
  session cookies.
- **Role guard:** endpoints are role-scoped (`ADMIN`, `PROVIDER`, `CUSTOMER`);
  using the wrong role returns `403 Forbidden`. Admins use the dedicated
  `/api/admin/*` routes instead of provider/customer routes.

---

## 7. Local setup

```bash
# 1. Backend (http://localhost:5000)
cd backend
cp .env.example .env      # fill in DATABASE_URL, JWT secrets, BCRYPT_SALT_ROUNDS
npm install
npx prisma generate
npm run db:refresh        # reset + migrate + seed (creates all accounts below)
npm run seed:admin        # or just re-create the admin account

# 2. Frontend (http://localhost:3000)
cd ..
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

After `db:refresh`, sign in with any account from [section 2](#2-seeded-accounts-roles--passwords).

> Seeder is **idempotent** — re-running it updates users/categories/gear instead
> of duplicating them; orders are skipped when their payment `transactionId`
> already exists.

