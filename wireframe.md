# GearUp — Wireframes & Design System

**Product:** GearUp — outdoor gear rental marketplace (Customer / Provider / Admin)
**Purpose of this doc:** a single source of truth an AI coding agent (or a human dev) can implement directly against — palette, type, spacing, motion, component states, and page-by-page wireframes for every module in the API.

---

## 0. Design Concept

**Subject:** people renting real outdoor gear (tents, backpacks, stoves) from other people, for a specific trip, on specific dates. The product's whole job is turning "I need a tent for 5 days" into a confirmed, paid booking with zero anxiety about condition, price, or availability.

**Direction — "Trailhead":** the visual language borrows from trail signage and topographic maps rather than generic SaaS gradients: contour-line dividers, a blaze-orange waypoint marker used for primary actions, and a route/trail motif for the rental lifecycle (Requested → Approved → Picked up → Returned) since that lifecycle *is* literally a path. This is deliberately not the cream+terracotta or near-black+neon-green default — the base is a deep pine ink, not black, and the accent is a more saturated safety-orange, not clay.

**Signature element:** a **contour-blaze progress trail** — a thin topographic contour line that runs through rental/order cards and status trackers, with filled "blaze" dots marking each completed stage. Used once, used consistently, not decorated further.

---

## 1. Color Palette

Token names first, hex second. Use CSS variables + Tailwind `theme.extend.colors` mapped to these tokens so light/dark just swap variable values.

### Light mode (default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F6F3EC` | Page background — warm parchment, not stark white |
| `--surface` | `#FFFFFF` | Cards, modals, inputs |
| `--surface-muted` | `#ECE7D9` | Secondary panels, table stripes |
| `--ink` | `#1A2420` | Primary text (deep pine-black, not pure black) |
| `--ink-muted` | `#5B6B62` | Secondary text, captions |
| `--border` | `#DAD3C0` | Hairline borders, dividers |
| `--accent` | `#E8622C` | **Trail-blaze orange** — primary buttons, active states, links |
| `--accent-hover` | `#CC4F1E` | Hover/active of accent |
| `--accent-soft` | `#FBE4D8` | Accent tint backgrounds (badges, chips) |
| `--pine` | `#2F6E62` | Secondary actions, "approved/success" states, contour lines |
| `--pine-soft` | `#DCEBE6` | Success tint background |
| `--gold` | `#D9A441` | Ratings, highlights, "featured" badges |
| `--danger` | `#C0392B` | Errors, cancel/delete, destructive confirm |
| `--danger-soft` | `#F6DEDA` | Error tint background |
| `--focus-ring` | `#2F6E62` | Keyboard focus outline (3px, offset 2px) |

### Dark mode

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#12211C` | Page background — deep pine ink |
| `--surface` | `#1B2E27` | Cards, modals |
| `--surface-muted` | `#223A32` | Secondary panels |
| `--ink` | `#EDE9DC` | Primary text |
| `--ink-muted` | `#9CB0A6` | Secondary text |
| `--border` | `#2E4740` | Hairlines |
| `--accent` | `#F0763F` | Brighter blaze-orange for dark contrast |
| `--accent-hover` | `#F58F5E` | |
| `--accent-soft` | `#3A2418` | |
| `--pine` | `#5FA692` | Lighter pine for dark bg contrast |
| `--pine-soft` | `#1D332C` | |
| `--gold` | `#E8BE6C` | |
| `--danger` | `#E2695A` | |
| `--danger-soft` | `#3A1F1B` | |
| `--focus-ring` | `#5FA692` | |

**Role-based accent (subtle, not loud):** Customer surfaces default to `--accent` (orange) CTAs. Provider surfaces default to `--pine` (teal-green) CTAs. Admin surfaces default to `--ink`/neutral CTAs with `--danger` reserved strictly for destructive admin actions. This is a quiet way to always tell users which "mode" they're in without a persistent banner.

---

## 2. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display (H1/H2, hero numbers, price) | **Fjalla One** | Condensed, signage-like — used only for headings, gear names on cards, and the price figure. Never body copy. |
| Body / UI | **Public Sans** | All paragraph text, labels, nav, buttons |
| Data / mono | **JetBrains Mono** | Order IDs, transaction IDs, dates in tables, API-like values |

Type scale (rem, 1rem = 16px):

```
display-xl   3.052   / line-height 1.05   — landing hero
display-lg   2.441   / 1.1                — page titles (Gear Detail name, Dashboard title)
display-md   1.953   / 1.15               — section headers
body-lg      1.25    / 1.5                — lead paragraphs
body-md      1.0     / 1.6                — default body
body-sm      0.875   / 1.5                — captions, meta
mono-sm      0.8125  / 1.4                — IDs, codes
```

Weights: Fjalla One is single-weight (400) by design — scale via size, not weight. Public Sans uses 400 (body), 500 (labels), 700 (emphasis/buttons).

---

## 3. Spacing, Radius, Elevation

- **Spacing scale:** 4px base — 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Radius:** `--radius-sm: 6px` (chips, inputs), `--radius-md: 12px` (cards, buttons), `--radius-lg: 20px` (modals, hero panels). No fully-rounded pill buttons except status badges.
- **Elevation:** flat by default (border, not shadow). Shadows only on floating elements (dropdowns, modals, toasts): `0 8px 24px -8px rgba(20,35,29,0.25)`.
- **Grid:** 12-column, max content width 1280px, gutter 24px. Mobile: single column, 16px side padding.

---

## 4. Iconography & Imagery

- Icon set: **Lucide** (matches shadcn/ui default), 1.5px stroke.
- Gear category icons used consistently: tent, backpack, flame (stove), compass (navigation gear), footprints (footwear).
- Photography: real gear photos on warm neutral backdrops (no busy lifestyle stock). Use `next/image` with a fixed 4:3 ratio for gear cards, 16:9 for hero.
- Empty states get a simple line-art contour illustration (mountain outline), never a generic "empty box" icon.

---

## 5. Motion Principles

Motion is used for **orientation and confirmation**, never decoration. Respect `prefers-reduced-motion` everywhere (disable all but opacity fades).

| Interaction | Motion |
|---|---|
| Page transition | None (Next.js server nav) — instant, rely on `loading.tsx` skeletons instead of spinners |
| Card hover (gear listing) | `translateY(-2px)` + border color shift to `--accent`, 150ms ease-out |
| Button press | `scale(0.98)`, 100ms |
| Modal / sheet open | Slide-up 16px + fade, 200ms ease-out; backdrop fade 150ms |
| Toast (Sonner) | Slide-in from bottom-right, 200ms; auto-dismiss 4s with a thin draining progress bar in `--accent` |
| Rental status change | The contour-blaze trail (see §0) animates its fill line left→right over 400ms when a new stage is reached — this is the one "signature" animation and should not be reused elsewhere |
| Form validation error | Field border flashes to `--danger`, shake `translateX` ±4px once, 150ms |
| Skeleton loading | Subtle shimmer sweep, 1.5s loop, using `--surface-muted` → `--border` gradient |
| Date range picker (react-day-picker) | Selected range fills with `--accent-soft`, endpoints get `--accent` solid circle, 100ms transition on hover |

---

## 6. Core Components (shadcn/ui base, themed)

- **Button:** `primary` (accent fill, white text), `secondary` (pine outline), `ghost`, `destructive` (danger fill). Height 40px default, 48px for checkout/payment CTAs.
- **Card:** 1px `--border`, `--radius-md`, `--surface` background, 20px padding. Gear card = image (4:3) + Fjalla One name + price/day in mono + rating chip (gold) + availability chip.
- **Status Badge:** pill, 12px text, colored by state:
  - `pending` → gold-soft bg / gold text
  - `approved` / `confirmed` → pine-soft bg / pine text
  - `active` (in-progress rental) → accent-soft bg / accent text
  - `completed` → ink-muted bg / ink text
  - `cancelled` / `rejected` → danger-soft bg / danger text
- **Skeleton:** used on every list/detail page inside `loading.tsx` — mirrors the exact final layout (image block, two text lines, price line) so there's no layout shift.
- **Empty state:** contour illustration + one-line explanation in interface voice ("No rentals yet. Browse gear to plan your first trip.") + single primary CTA.
- **Data table (Admin/Provider):** sticky header, zebra striping via `--surface-muted`, row hover `--accent-soft` at 30% opacity, mono font for ID/date columns.
- **Toast (Sonner):** success = pine icon, error = danger icon, always states the action in past tense ("Gear updated", "Rental cancelled") matching the button that triggered it.

---

## 7. Page Wireframes

### 7.1 Public — Home (`/`)

```
┌─────────────────────────────────────────────┐
│ Logo   Browse Gear   How it works   [Login] [Sign up] │  <- sticky nav, --bg
├─────────────────────────────────────────────┤
│  DISPLAY-XL: "Gear up. Head out."            │
│  body-lg subhead + [Search location/date bar]│  <- hero, contour-line bg texture
├─────────────────────────────────────────────┤
│  Category strip: Tent | Backpack | Stove | …  (icon + label, horizontal scroll on mobile)
├─────────────────────────────────────────────┤
│  "Popular near you"                           │
│  [GearCard] [GearCard] [GearCard] [GearCard]  │  <- grid 4/2/1 responsive
├─────────────────────────────────────────────┤
│  "How GearUp works" — 3-step blaze trail      │  <- uses contour-blaze motif, real sequence so numbering is justified
│  ○ Book dates → ○ Provider approves → ○ Pick up gear
├─────────────────────────────────────────────┤
│  Footer: links, socials, theme toggle         │
└─────────────────────────────────────────────┘
```

### 7.2 Public — Gear Listing (`/gear`)

```
┌──────────────┬──────────────────────────────┐
│ FILTERS (left, sticky) │ Sort: [Price ▾]  Results: 128 │
│ - Category checkboxes  ├──────────────────────────────┤
│ - Price range slider   │ [GearCard][GearCard][GearCard]│
│ - Date availability    │ [GearCard][GearCard][GearCard]│
│ - Condition            │ ...  Pagination / infinite scroll
└──────────────┴──────────────────────────────┘
Mobile: filters collapse into a bottom sheet triggered by a "Filters" button.
```

GearCard hover → lift + accent border (see §5). Skeleton grid shown while TanStack Query fetches `GET /api/gear`.

### 7.3 Public — Gear Detail (`/gear/[id]`)

```
┌───────────────────┬─────────────────────────┐
│ Image gallery      │ DISPLAY-LG: Tent 4-Person│
│ (main + thumbnails)│ ★ 4.8 (23 reviews)  chip: available │
│                    │ mono: $25/day            │
│                    │ Description body-md      │
│                    │ ─────────────────────────│
│                    │ [react-day-picker range]  │
│                    │ Quantity stepper           │
│                    │ Total: $125 (auto-calc)     │
│                    │ [Reserve — primary, 48px]  │
├───────────────────┴─────────────────────────┤
│ Reviews section — list of ReviewCard (avatar initial, stars, comment, date)
│ [Write a review] (only if user has completed rental for this gear)
└──────────────────────────────────────────────┘
```

Unavailable date ranges are visually disabled (struck, `--ink-muted`) in the day-picker by cross-referencing existing rentals for that gear.

### 7.4 Auth — Login / Register (`/login`, `/register`)

```
┌──────────────────────────────┐
│         [GearUp logo]         │
│   DISPLAY-MD: Welcome back    │
│   [Email input]               │
│   [Password input]  (eye toggle)│
│   [ ] Remember me     Forgot? │
│   [Log in — primary full-width]│
│   ── or ──                     │
│   "New here? Create an account"│
└──────────────────────────────┘
Centered card, max-width 420px, contour texture faint in the page background only.
```

Register adds name / phone / address / confirm-password with React Hook Form + Zod inline validation (error text `body-sm` in `--danger` directly under field, shake animation per §5). On submit: cookie set server-side → redirect to role-based dashboard.

### 7.5 Customer — Dashboard (`/dashboard`)

```
┌───────────────────────────────────────────┐
│ Welcome back, {name}                        │
│ [Active rentals: 2] [Total spent: $340] [Reviews: 3]  <- stat cards
├───────────────────────────────────────────┤
│ "Your active rentals"                       │
│ RentalCard: gear thumb | name | dates | contour-blaze status trail | [View] [Cancel]
├───────────────────────────────────────────┤
│ "Recent activity" — table (past rentals), link to /dashboard/rentals
└───────────────────────────────────────────┘
```

### 7.6 Customer — Rental Detail & Checkout (`/dashboard/rentals/[id]`)

```
┌───────────────────────────────────────────┐
│ Contour-blaze trail: Requested ●━━○ Approved ○ Picked up ○ Returned │
│ Gear summary card                          │
│ Dates, quantity, subtotal, total  (mono)   │
│ Provider contact (read-only)               │
├───────────────────────────────────────────┤
│ [If unpaid] → Stripe Checkout panel:        │
│   "Pay $125" primary button → redirects to Stripe-hosted Checkout (POST /api/payments/create) │
│   On return: confirm via POST /api/payments/confirm, toast "Payment confirmed" │
│ [If pending] → [Cancel rental] secondary/destructive
└───────────────────────────────────────────┘
```

### 7.7 Provider — Dashboard (`/provider`)

```
┌───────────────────────────────────────────┐
│ Stat cards: Listings active | Pending orders | Revenue (mo.) — Recharts sparkline under each │
├───────────────────────────────────────────┤
│ "Orders needing action" — table: gear | customer | dates | [Approve] [Reject]
├───────────────────────────────────────────┤
│ "Your gear" — grid of ProviderGearCard with inline stock/price edit affordance
│ [+ Add gear] floating primary button (bottom-right on mobile, inline top-right on desktop)
└───────────────────────────────────────────┘
```

### 7.8 Provider — Gear Form (`/provider/gear/new`, `/provider/gear/[id]/edit`)

```
┌──────────────────────────────┐
│ DISPLAY-MD: Add gear           │
│ [Name] [Category select]       │
│ [Description textarea]         │
│ [Price/day] [Stock] [Condition select] │
│ [Image upload — drag/drop, next/image preview] │
│ [Save — primary] [Cancel — ghost]│
└──────────────────────────────┘
Client Component (form interactivity), Zod schema mirrors gear POST/PUT body exactly.
```

### 7.9 Admin — Dashboard (`/admin`)

```
┌───────────────────────────────────────────┐
│ Stat cards: Users | Gear listings | Active rentals | Revenue — Recharts bar/line │
├───────────────────────────────────────────┤
│ Tabs: Users | Gear | Rentals                │
│  Users tab: DataTable (name, email, role chip, status, [Edit role])
│  Gear tab: DataTable (name, provider, category, status, [Suspend])
│  Rentals tab: DataTable (customer, gear, dates, status, amount)
└───────────────────────────────────────────┘
```

Role edit opens a small dialog (shadcn `Dialog`) with a role `Select` (`CUSTOMER`/`PROVIDER`/`ADMIN`) → `PATCH /api/admin/users/:id`, toast "User role updated".

### 7.10 Shared — Navigation & Role Switching

```
Top nav changes by role after /auth/me resolves:
 - CUSTOMER: Browse Gear | My Rentals | Profile
 - PROVIDER: Dashboard | My Gear | Orders | Profile
 - ADMIN: Dashboard | Users | Gear | Rentals
Avatar menu (bottom-left on desktop sidebar, top-right on mobile) → Profile, Theme toggle, Log out.
```

Provider/Admin use a **left sidebar layout** (`app/(provider)/layout.tsx`, `app/(admin)/layout.tsx`); Public/Customer use a **top nav layout** (`app/(public)/layout.tsx`, `app/(customer)/layout.tsx`) — this split itself signals "you're in a workspace" vs "you're shopping."

---

## 8. Responsive Rules

- Breakpoints: `sm 640` `md 768` `lg 1024` `xl 1280` (Tailwind defaults, unchanged).
- Sidebar layouts (Provider/Admin) collapse to a bottom sheet + hamburger below `lg`.
- All tables become stacked cards below `md` (each row → a bordered card with label:value pairs).
- Sticky date/booking panel on Gear Detail becomes a bottom sheet (`Drawer`) below `md`, triggered by a persistent "Reserve" bar.

---

## 9. Accessibility

- All interactive elements keyboard-reachable, visible focus ring = `--focus-ring`, 3px, 2px offset.
- Color is never the only status signal — every badge also carries a text label.
- Minimum contrast: body text 4.5:1 against `--bg`/`--surface` in both themes (verify `--accent` text is never used as body copy at small sizes — use `--accent` only for large text, icons, or fills with white/ink text on top).
- Motion respects `prefers-reduced-motion: reduce` — disable shimmer, shake, slide; keep only opacity fades.
- Forms: every input has a visible `<label>`, errors linked via `aria-describedby`.

---

## 10. Product Directory Structure

```
gearup-frontend/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Home
│   │   │   ├── gear/
│   │   │   │   ├── page.tsx                # Listing
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx            # Detail
│   │   │   │       ├── loading.tsx
│   │   │   │       └── not-found.tsx
│   │   │   └── how-it-works/page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (customer)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── rentals/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/page.tsx       # rental detail + checkout
│   │   │   └── profile/page.tsx
│   │   ├── (provider)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Provider dashboard
│   │   │   ├── gear/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── gear/page.tsx
│   │   │   └── rentals/page.tsx
│   │   ├── api/                            # route handlers if needed (e.g. cookie relay)
│   │   ├── layout.tsx                      # root layout, providers mounted here
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn/ui primitives (button, card, dialog, input, select, table, drawer, sonner...)
│   │   ├── layout/
│   │   │   ├── TopNav.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── shared/
│   │       ├── StatusBadge.tsx
│   │       ├── ContourBlazeTrail.tsx        # signature status trail component
│   │       ├── SkeletonCard.tsx
│   │       ├── EmptyState.tsx
│   │       └── ThemeToggle.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/ (LoginForm.tsx, RegisterForm.tsx)
│   │   ├── gear/
│   │   │   ├── components/ (GearCard.tsx, GearFilters.tsx, GearGallery.tsx, GearForm.tsx)
│   │   ├── rentals/
│   │   │   ├── components/ (RentalCard.tsx, DateRangePicker.tsx, RentalStatusTrail.tsx)
│   │   ├── payments/
│   │   │   ├── components/ (CheckoutPanel.tsx)
│   │   ├── reviews/
│   │   │   ├── components/ (ReviewList.tsx, ReviewForm.tsx)
│   │   ├── provider/
│   │   │   ├── components/ (OrdersTable.tsx, ProviderGearCard.tsx)
│   │   └── admin/
│   │       ├── components/ (UsersTable.tsx, AdminGearTable.tsx, AdminRentalsTable.tsx, RevenueChart.tsx)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                      # wraps /me query
│   │   ├── useGear.ts
│   │   ├── useRentals.ts
│   │   ├── usePayments.ts
│   │   ├── useReviews.ts
│   │   ├── useProviderGear.ts
│   │   ├── useProviderOrders.ts
│   │   └── useAdmin.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts                 # register, login, me, refresh
│   │   ├── gear.service.ts
│   │   ├── providerGear.service.ts
│   │   ├── rentals.service.ts
│   │   ├── payments.service.ts
│   │   ├── reviews.service.ts
│   │   ├── providerOrders.service.ts
│   │   └── admin.service.ts
│   │
│   ├── lib/
│   │   ├── fetcher.ts                      # fetch wrapper, credentials: "include", error normalization
│   │   ├── queryClient.ts
│   │   └── stripe.ts
│   │
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── AppProviders.tsx                # composes Theme + Query + Tooltip + Toaster
│   │
│   ├── store/
│   │   ├── useUserStore.ts                 # zustand, hydrated from /me — no tokens stored here
│   │   ├── useCartStore.ts                 # optional: pending rental draft (dates/qty) pre-checkout
│   │   └── useUiStore.ts                   # sidebar open/closed, filter sheet state
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── gear.types.ts
│   │   ├── rental.types.ts
│   │   ├── payment.types.ts
│   │   ├── review.types.ts
│   │   └── admin.types.ts
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts                   # date-fns wrappers
│   │   ├── roleGuards.ts
│   │   └── cn.ts                           # shadcn class merge helper
│   │
│   └── middleware.ts                       # route protection + role-based redirects via cookie-decoded session
│
├── public/
│   ├── images/
│   └── icons/
├── .env.local.example
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── README.md
├── API_INTEGRATION.md
└── package.json
```

---

## 11. Implementation Notes for an AI Agent

1. Build `lib/fetcher.ts` and all `services/*.ts` first — every hook and component depends on them, and every endpoint here maps 1:1 to a Postman request in the source collection (`Auth`, `Gear`, `Provider Gear`, `Rentals`, `Payments`, `Reviews`, `Provider Orders`, `Admin`).
2. Implement `middleware.ts` before any protected route pages — redirect unauthenticated users to `/login`, and redirect wrong-role users to their own dashboard root.
3. Build `components/shared/ContourBlazeTrail.tsx` once and reuse it everywhere a rental status appears (dashboard card, rental detail, provider order row) — do not reimplement per-page.
4. Wire theme tokens as CSS variables in `globals.css` under `:root` and `.dark`, then reference them in `tailwind.config.ts` `theme.extend.colors` so `bg-accent`, `text-ink`, etc. work directly in JSX.
5. Every list page (`gear`, `dashboard/rentals`, `provider/orders`, `admin/*`) ships a matching `loading.tsx` skeleton before wiring real data — layout should not shift when data arrives.