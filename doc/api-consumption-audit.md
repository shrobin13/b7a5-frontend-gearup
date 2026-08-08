# GearUp Frontend — API Consumption Audit

**Date:** 2026-08-05
**Scope:** All endpoints in `api-doc.json` (Postman collection) vs. frontend consumption
**Result:** 21 of 30 endpoints are consumed; 9 are not consumed.

---

## 1. Endpoint Inventory (All 30 from api-doc.json)

| # | Method | Endpoint | Section | Consumed? |
| --- | --- | --- | --- | --- |
| 1 | POST | `/api/auth/register` | Auth | ✅ Yes |
| 2 | GET | `/api/auth/me` | Auth | ✅ Yes |
| 3 | POST | `/api/auth/login` | Auth | ✅ Yes |
| 4 | POST | `/api/auth/refresh-token` | Auth | ✅ Yes |
| 5 | DELETE | `/api/gear/:gearId` | Gear | ⚠️ Bypassed (uses provider gear) |
| 6 | PUT | `/api/gear/:gearId` | Gear | ⚠️ Bypassed (uses provider gear) |
| 7 | POST | `/api/gear` | Gear | ⚠️ Bypassed (uses provider gear) |
| 8 | GET | `/api/gear/:gearId` | Gear | ✅ Yes |
| 9 | GET | `/api/gear` | Gear | ✅ Yes |
| 10 | DELETE | `/api/provider/gear/:gearId` | Provider Gear | ✅ Yes |
| 11 | PUT | `/api/provider/gear/:gearId` | Provider Gear | ✅ Yes |
| 12 | POST | `/api/provider/gear` | Provider Gear | ✅ Yes |
| 13 | GET | `/api/provider/gear/:gearId` | Provider Gear | ❌ No service function |
| 14 | GET | `/api/provider/gear` | Provider Gear | ✅ Yes |
| 15 | PATCH | `/api/rentals/:rentalId/cancel` | Rentals | ❌ Dead code (service only) |
| 16 | GET | `/api/rentals/:rentalId` | Rentals | ❌ Dead code (service only) |
| 17 | GET | `/api/rentals` | Rentals | ✅ Yes |
| 18 | POST | `/api/rentals` | Rentals | ✅ Yes |
| 19 | GET | `/api/payments/:paymentId` | Payments | ❌ Dead code (service only) |
| 20 | GET | `/api/payments` | Payments | ✅ Yes |
| 21 | POST | `/api/payments/confirm` | Payments | ❌ Dead code (service only) |
| 22 | POST | `/api/payments/create` | Payments | ✅ Yes |
| 23 | GET | `/api/reviews/:gearId` | Reviews | ✅ Yes |
| 24 | POST | `/api/reviews` | Reviews | ✅ Yes |
| 25 | PATCH | `/api/provider/orders/:orderId` | Provider Orders | ❌ Dead code (service only) |
| 26 | GET | `/api/provider/orders` | Provider Orders | ✅ Yes |
| 27 | GET | `/api/admin/rentals` | Admin | ✅ Yes |
| 28 | GET | `/api/admin/gear` | Admin | ✅ Yes |
| 29 | PATCH | `/api/admin/users/:userId` | Admin | ✅ Yes |
| 30 | GET | `/api/admin/users` | Admin | ✅ Yes |

---

## 2. Fully Consumed Endpoints (21)

| Endpoint | Method | Service Function | Frontend Location |
| --- | --- | --- | --- |
| `/api/auth/register` | POST | `register()` in `services/auth.ts` | `app/(authGroup)/register/page.tsx` |
| `/api/auth/me` | GET | `getMe()` in `services/auth.ts`, `app/api/auth/me/route.ts` | `store/auth-store.ts` |
| `/api/auth/login` | POST | `login()` in `services/auth.ts`, `app/api/auth/login/route.ts` | `app/(authGroup)/login/page.tsx` |
| `/api/auth/refresh-token` | POST | `refreshSession()` in `lib/auth-server.ts` | `app/api/auth/refresh/route.ts` |
| `/api/gear` | GET | `getAllGear()` in `services/gear.ts` | `app/page.tsx`, `app/gear/page.tsx` |
| `/api/gear/:gearId` | GET | `getGearById()` in `services/gear.ts` | `app/gear/[id]/page.tsx` |
| `/api/provider/gear` | POST | `createGear()` in `services/gear.ts` | `app/provider/add-gear/page.tsx` (intended) |
| `/api/provider/gear/:gearId` | PUT | `updateGear()` in `services/gear.ts` | Provider inventory (intended) |
| `/api/provider/gear/:gearId` | DELETE | `deleteGear()` in `services/gear.ts` | Provider inventory (intended) |
| `/api/provider/gear` | GET | `getProviderGear()` in `services/provider.ts` | `app/provider/page.tsx`, `app/provider/inventory/page.tsx` |
| `/api/rentals` | POST | `createRental()` in `services/customer.ts` | `app/gear/[id]/page.tsx` |
| `/api/rentals` | GET | `getMyRentals()` in `services/customer.ts` | `app/dashboard/page.tsx`, `app/gear/[id]/page.tsx` |
| `/api/payments/create` | POST | `createPayment()` in `services/payment.ts` | `app/gear/[id]/page.tsx` |
| `/api/payments` | GET | `getMyPayments()` in `services/customer.ts` | `app/dashboard/page.tsx`, `app/dashboard/payments/page.tsx` |
| `/api/reviews/:gearId` | GET | `getGearReviews()` in `services/reviews.ts` | `app/gear/[id]/page.tsx` |
| `/api/reviews` | POST | `createReview()` in `services/reviews.ts` | `app/gear/[id]/page.tsx` |
| `/api/provider/orders` | GET | `getProviderOrders()` in `services/provider.ts` | `app/provider/page.tsx`, `app/provider/orders/page.tsx` |
| `/api/admin/rentals` | GET | `getAdminRentals()` in `services/admin.ts` | `app/admin/page.tsx`, `app/admin/rentals/page.tsx` |
| `/api/admin/gear` | GET | `getAdminGear()` in `services/admin.ts` | `app/admin/page.tsx`, `app/admin/gear/page.tsx` |
| `/api/admin/users/:userId` | PATCH | `updateUserRole()` in `services/admin.ts` | `app/admin/users/page.tsx` |
| `/api/admin/users` | GET | `getAdminUsers()` in `services/admin.ts` | `app/admin/page.tsx`, `app/admin/users/page.tsx` |

---

## 3. Missing Endpoints (9)

### Category A — No service function exists (1)

| Endpoint | Method | Issue |
| --- | --- | --- |
| `GET /api/provider/gear/:gearId` | GET | **Get Provider Gear by ID** — No service function defined anywhere in the frontend. |

### Category B — Service function defined but dead code (never called in UI) (5)

| Endpoint | Method | Service Function | Issue |
| --- | --- | --- | --- |
| `PATCH /api/rentals/:rentalId/cancel` | PATCH | `cancelRental()` in `services/customer.ts` | Defined but never imported/called by any page or component. |
| `GET /api/rentals/:rentalId` | GET | `getRentalById()` in `services/customer.ts` | Defined but never imported/called by any page or component. |
| `GET /api/payments/:paymentId` | GET | `getPaymentById()` in `services/payment.ts` | Defined but never imported/called by any page or component. |
| `POST /api/payments/confirm` | POST | `confirmPayment()` in `services/payment.ts` | Defined but never imported/called by any page or component. `app/payment/success/page.tsx` is a static page with no API call. |
| `PATCH /api/provider/orders/:orderId` | PATCH | `updateProviderOrder()` in `services/provider.ts` | Defined but never imported/called by any page or component. `app/provider/orders/page.tsx` only lists orders (GET) — no approve/update action. |

### Category C — Bypassed in favor of "Provider Gear" endpoints (3)

| Endpoint | Method | Alternative Used | Notes |
| --- | --- | --- | --- |
| `POST /api/gear` | POST | `POST /api/provider/gear` | Frontend creates gear via provider endpoint. |
| `PUT /api/gear/:gearId` | PUT | `PUT /api/provider/gear/:gearId` | Frontend updates gear via provider endpoint. |
| `DELETE /api/gear/:gearId` | DELETE | `DELETE /api/provider/gear/:gearId` | Frontend deletes gear via provider endpoint. |

> These "Gear" section endpoints are likely the admin-facing variants. They are not called anywhere in the frontend. If the backend requires the admin to use `/api/gear` (not `/api/provider/gear`), these are true gaps.

---

## 4. Additional Observations

1. **`app/provider/add-gear/page.tsx` is a static form** — it renders inputs and a "Save gear" button but does **not** call `createGear()` on submit. The `createGear()` service exists, but the page never invokes it.
2. **`app/provider/inventory/page.tsx`** lists inventory (GET) but has no edit/delete actions wired to `updateGear()` / `deleteGear()`. The "+ Add gear" button is also non-functional (not a link/navigation).
3. **`app/provider/orders/page.tsx`** lists orders (GET) but has no approve/update action wired to `updateProviderOrder()`. The "Export report" button is static.
4. **`app/dashboard/orders/page.tsx`** is a static empty state — it does not call `getMyRentals()` or `getRentalById()`.
5. **`app/payment/success/page.tsx`** is a static confirmation page — it does not call `getPaymentById()` or `confirmPayment()`.
6. **No service function exists for `GET /api/provider/gear/:gearId`** at all — this is the only endpoint with zero frontend representation.
7. **`app/payment/cancel/page.tsx`** exists but does not call the cancel rental endpoint.

---

## 5. Recommended Next Steps

1. **Add `getProviderGearById()`** service for `GET /api/provider/gear/:gearId` and wire it into a provider gear detail/inventory view.
2. **Wire the dead-code services** into their intended UI:
   - `cancelRental()` → rental detail or dashboard orders list
   - `getRentalById()` → rental detail page
   - `getPaymentById()` → payment success/confirmation page
   - `confirmPayment()` → payment success flow
   - `updateProviderOrder()` → provider orders approve/reject actions
3. **Make `app/provider/add-gear/page.tsx` functional** — call `createGear()` on submit.
4. **Add edit/delete actions** to provider inventory using `updateGear()` / `deleteGear()`.
5. **Clarify the Gear vs. Provider Gear admin endpoints** — if admin moderation requires `/api/gear`, implement those calls; otherwise document the intentional use of `/api/provider/gear` and remove the unused "Gear" section from scope.

---

# Frontend Implementation Audit

**Date:** 2026-08-05
**Scope:** Every frontend page/component vs. the service functions defined in `services/*.ts` and the API routes in `app/api/**`
**Result:** 11 of 19 interactive pages are fully wired; 4 are partially wired; 4 are static placeholders. 10 of 26 service functions are never called (8 dead code, 2 bypassed by raw `fetch`).

---

## 1. Page-by-Page Implementation Status

| Page | Service(s) Used | Status |
| --- | --- | --- |
| `app/page.tsx` | `getAllGear()` | ✅ Implemented |
| `app/gear/page.tsx` | `getAllGear()` | ✅ Implemented |
| `app/gear/[id]/page.tsx` | `getGearById()`, `getGearReviews()`, `createReview()`, `createRental()`, `getMyRentals()`, `createPayment()` | ✅ Implemented (most complete page) |
| `app/(authGroup)/login/page.tsx` | raw `fetch("/api/auth/login")` | ⚠️ Implemented but bypasses `login()` service |
| `app/(authGroup)/register/page.tsx` | `register()` | ✅ Implemented |
| `app/dashboard/page.tsx` | `getMyRentals()`, `getMyPayments()` | ✅ Implemented |
| `app/dashboard/orders/page.tsx` | — | ❌ Static empty state, no API call |
| `app/dashboard/payments/page.tsx` | `getMyPayments()` | ✅ Implemented |
| `app/dashboard/profile/page.tsx` | reads `useAuthStore` only | ⚠️ No API call (reads cached user) |
| `app/provider/page.tsx` | `getProviderGear()`, `getProviderOrders()` | ✅ Implemented |
| `app/provider/add-gear/page.tsx` | — | ❌ Static form, `createGear()` never called |
| `app/provider/inventory/page.tsx` | `getProviderGear()` | ⚠️ Lists only; no edit/delete actions |
| `app/provider/orders/page.tsx` | `getProviderOrders()` | ⚠️ Lists only; no approve/update action |
| `app/admin/page.tsx` | `getAdminGear()`, `getAdminRentals()`, `getAdminUsers()` | ✅ Implemented |
| `app/admin/gear/page.tsx` | `getAdminGear()` | ✅ Implemented |
| `app/admin/rentals/page.tsx` | `getAdminRentals()` | ✅ Implemented |
| `app/admin/users/page.tsx` | `getAdminUsers()`, `updateUserRole()` | ✅ Implemented (full CRUD dialog) |
| `app/payment/success/page.tsx` | — | ❌ Static confirmation, no API call |
| `app/payment/cancel/page.tsx` | — | ❌ Static, no cancel/API call |
| `app/about/page.tsx`, `app/contact/page.tsx` | — | Static marketing pages (no API expected) |

---

## 2. Service Function Usage (Defined vs. Called)

### ✅ Called by UI (16)

| Service Function | File | Called From |
| --- | --- | --- |
| `register()` | `services/auth.ts` | `app/(authGroup)/register/page.tsx` |
| `logout()` | `services/auth.ts` | `components/layout/site-header.tsx` |
| `getAllGear()` | `services/gear.ts` | `app/page.tsx`, `app/gear/page.tsx` |
| `getGearById()` | `services/gear.ts` | `app/gear/[id]/page.tsx` |
| `getProviderGear()` | `services/provider.ts` | `app/provider/page.tsx`, `app/provider/inventory/page.tsx` |
| `getProviderOrders()` | `services/provider.ts` | `app/provider/page.tsx`, `app/provider/orders/page.tsx` |
| `getMyRentals()` | `services/customer.ts` | `app/dashboard/page.tsx`, `app/gear/[id]/page.tsx` |
| `createRental()` | `services/customer.ts` | `app/gear/[id]/page.tsx` |
| `getMyPayments()` | `services/customer.ts` | `app/dashboard/page.tsx`, `app/dashboard/payments/page.tsx` |
| `createPayment()` | `services/payment.ts` | `app/gear/[id]/page.tsx` |
| `getGearReviews()` | `services/reviews.ts` | `app/gear/[id]/page.tsx` |
| `createReview()` | `services/reviews.ts` | `app/gear/[id]/page.tsx` |
| `getAdminUsers()` | `services/admin.ts` | `app/admin/page.tsx`, `app/admin/users/page.tsx` |
| `updateUserRole()` | `services/admin.ts` | `app/admin/users/page.tsx` |
| `getAdminGear()` | `services/admin.ts` | `app/admin/page.tsx`, `app/admin/gear/page.tsx` |
| `getAdminRentals()` | `services/admin.ts` | `app/admin/page.tsx`, `app/admin/rentals/page.tsx` |

### ⚠️ Bypassed — service exists but page uses raw `fetch` (2)

| Service Function | File | Actual Usage |
| --- | --- | --- |
| `login()` | `services/auth.ts` | `app/(authGroup)/login/page.tsx` calls `fetch("/api/auth/login")` directly |
| `getCurrentUser()` | `services/auth.ts` | `store/auth-store.ts` calls `fetch("/api/auth/me")` directly |

### ❌ Dead code — defined but never imported/called (8)

| Service Function | File | Notes |
| --- | --- | --- |
| `createGear()` | `services/gear.ts` | `app/provider/add-gear/page.tsx` is a static form |
| `updateGear()` | `services/gear.ts` | Provider inventory has no edit action |
| `deleteGear()` | `services/gear.ts` | Provider inventory has no delete action |
| `getRentalById()` | `services/customer.ts` | No rental detail page exists |
| `cancelRental()` | `services/customer.ts` | No cancel action wired anywhere |
| `getPaymentById()` | `services/payment.ts` | `app/payment/success/page.tsx` is static |
| `confirmPayment()` | `services/payment.ts` | `app/payment/success/page.tsx` is static |
| `updateProviderOrder()` | `services/provider.ts` | `app/provider/orders/page.tsx` only lists (GET) |

---

## 3. API Route Implementation Status (`app/api/**`)

| Route | Method | Status |
| --- | --- | --- |
| `app/api/auth/login/route.ts` | POST | ✅ Implemented (proxies to backend, sets cookies, fetches `/me`) |
| `app/api/auth/register/route.ts` | POST | ✅ Implemented |
| `app/api/auth/me/route.ts` | GET | ✅ Implemented |
| `app/api/auth/refresh/route.ts` | POST | ✅ Implemented |
| `app/api/auth/logout/route.ts` | POST | ✅ Implemented |
| `app/api/backend/[...path]/route.ts` | GET/POST/PUT/PATCH/DELETE | ✅ Generic proxy to backend |

---

## 4. Key Findings

1. **`app/gear/[id]/page.tsx` is the only fully-featured page** — it wires gear detail, reviews (list + create), rental creation, payment creation, and disabled-date computation from existing rentals.
2. **`app/(authGroup)/login/page.tsx` bypasses the `login()` service** — it calls `fetch("/api/auth/login")` directly. The `login()` service in `services/auth.ts` is dead code. Same for `getCurrentUser()` vs. `store/auth-store.ts`'s raw fetch.
3. **`app/provider/add-gear/page.tsx` is a static form** — the "Save gear" button does nothing; `createGear()` is never invoked.
4. **`app/provider/inventory/page.tsx` lists but cannot edit/delete** — `updateGear()` / `deleteGear()` are dead code; the "+ Add gear" button is not a link.
5. **`app/provider/orders/page.tsx` lists but cannot approve/reject** — `updateProviderOrder()` is dead code; "Export report" is static.
6. **`app/dashboard/orders/page.tsx` is a static empty state** — it never calls `getMyRentals()` or `getRentalById()`, even though the dashboard overview already fetches rentals.
7. **`app/payment/success/page.tsx` and `app/payment/cancel/page.tsx` are static** — they never call `getPaymentById()`, `confirmPayment()`, or `cancelRental()`. The success page even hardcodes "Trail Pro Tent / $180 / Aug 12–18".
8. **`app/dashboard/profile/page.tsx` reads the cached user from the auth store** — it does not re-fetch `/api/auth/me`, so profile data may be stale after login.
9. **`app/admin/users/page.tsx` is the most complete admin page** — it has a full edit dialog wired to `updateUserRole()` with role + status toggles.
10. **`app/admin/gear/page.tsx` and `app/admin/rentals/page.tsx` are read-only** — they list data but have no moderation actions (no delete gear, no cancel rental).

---

## 5. What's Left to Implement

### High priority (dead-code services to wire up)

1. **`createGear()`** → make `app/provider/add-gear/page.tsx` submit the form and call `createGear()`.
2. **`updateGear()` / `deleteGear()`** → add edit/delete actions to `app/provider/inventory/page.tsx`.
3. **`updateProviderOrder()`** → add approve/reject actions to `app/provider/orders/page.tsx`.
4. **`getMyRentals()` / `getRentalById()`** → replace the static empty state in `app/dashboard/orders/page.tsx` with a real rental list.
5. **`getPaymentById()` / `confirmPayment()`** → make `app/payment/success/page.tsx` fetch the payment and confirm it instead of showing hardcoded data.
6. **`cancelRental()`** → wire a cancel action into the dashboard orders list or a rental detail view.

### Medium priority (bypasses to reconcile)

7. **`login()` service** → either use it in `app/(authGroup)/login/page.tsx` or delete it to avoid confusion.
8. **`getCurrentUser()` service** → either use it in `store/auth-store.ts` or delete it.
9. **`app/dashboard/profile/page.tsx`** → re-fetch `/api/auth/me` on mount so profile reflects the latest server state.

### Low priority (nice-to-have)

10. **Admin moderation actions** — add delete-gear / cancel-rental actions to `app/admin/gear/page.tsx` and `app/admin/rentals/page.tsx` if the backend supports them.
11. **`app/payment/cancel/page.tsx`** — wire it to `cancelRental()` or document it as a static fallback.
12. **`getProviderGearById()`** — no service exists for `GET /api/provider/gear/:gearId`; add it if a provider gear detail view is needed.
