# API Integration Mapping

This document maps the main frontend routes and UI to the GearUp backend endpoints.

| Component / Screen | API Endpoint | Method | Notes |
| --- | --- | --- | --- |
| Login form | `/api/auth/login` | `POST` | Authenticates the user and returns a JWT token |
| Register form | `/api/auth/register` | `POST` | Creates a new customer or provider account |
| Current user fetch | `/api/auth/me` | `GET` | Reads the authenticated user profile |
| Logout | `/api/auth/logout` | `POST` | Ends the current session |
| Gear catalog | `/api/gear` | `GET` | Lists public and available gear |
| Gear detail | `/api/gear/:id` | `GET` | Fetches a specific gear item |
| Provider create gear | `/api/provider/gear` | `POST` | Creates gear for the logged-in provider |
| Provider update gear | `/api/provider/gear/:id` | `PUT` | Updates gear details |
| Provider delete gear | `/api/provider/gear/:id` | `DELETE` | Removes gear from inventory |
| Provider inventory | `/api/provider/gear` | `GET` | Lists provider-owned inventory |
| Create rental | `/api/rentals` | `POST` | Submits a rental order |
| My rentals | `/api/rentals` | `GET` | Lists the renter's rentals |
| Cancel rental | `/api/rentals/:id/cancel` | `PATCH` | Cancels a pending rental |
| Create payment | `/api/payments/create` | `POST` | Initiates a payment session |
| Confirm payment | `/api/payments/confirm` | `POST` | Confirms successful payment |
| My payments | `/api/payments` | `GET` | Lists user payments |
| Provider orders | `/api/provider/orders` | `GET` | Lists booking requests for a provider |
| Update provider order | `/api/provider/orders/:id` | `PATCH` | Approves or updates an order |
| Admin users | `/api/admin/users` | `GET` | Lists all users |
| Admin update user | `/api/admin/users/:id` | `PATCH` | Updates role or status |
| Admin gear | `/api/admin/gear` | `GET` | Lists gear pending moderation |
| Admin rentals | `/api/admin/rentals` | `GET` | Platform-wide rental overview |

## Base configuration

- Base URL: `NEXT_PUBLIC_API_URL`
- Token header: `Authorization: Bearer <token>`
- Error handling: centralized in `lib/api.ts`
