
I have a full-stack TypeScript project that works locally but fails after deployment on Render.

Architecture:

Frontend:
- Next.js deployed on Render
- URL: https://b7a5-frontend-gearup-1.onrender.com

Backend:
- Express + TypeScript + Prisma deployed on Render
- URL: https://gearup-igqw.onrender.com

Problem:

Local development works correctly:
- Register works
- Login works
- /api/auth/me works

After deployment:
- POST https://b7a5-frontend-gearup-1.onrender.com/api/auth/register returns 500
- POST /api/auth/login returns 500
- GET /api/auth/me returns 401

Browser console:
```

POST /api/auth/register 500 Internal Server Error
GET /api/auth/me 401 Unauthorized

````

The frontend does not directly call the backend. It uses a Next.js API proxy:

Browser:
Frontend /api/auth/register
        |
        |
        v
Next.js server proxy
        |
        |
        v
Express backend /api/auth/register


Backend CORS:

```ts
app.use(cors({
  origin: env.CLIENT_URL,
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials:true,
}));
````

Environment:

```env
CLIENT_URL=https://b7a5-frontend-gearup-1.onrender.com/
```

(Note: there is a trailing slash)

Backend auth flow:

* Register creates user with Prisma
* Generates JWT access token and refresh token
* Login also generates tokens
* Cookies are used for authentication

Backend likely sets cookies like:

```ts
res.cookie("accessToken", token)
res.cookie("refreshToken", refreshToken)
```

Frontend cookie configuration:

```ts
export const AUTH_COOKIE_NAMES = {
  access: "access-token",
  refresh: "gearup-refresh-token",
  role: "gearup-role",
};
```

Frontend cookie flags:

```ts
return {
  httpOnly,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge
}
```

Frontend proxy function:

```ts
export async function proxyToBackend(
 request,
 pathSegments,
 authCookieName = AUTH_COOKIE_NAMES.access
) {

 const cookieStore = await cookies();

 const accessToken =
    cookieStore.get(authCookieName)?.value;

 if (!accessToken) {
    return NextResponse.json(
      {
       success:false,
       message:"Authentication required"
      },
      {
       status:401
      }
    );
 }

 // forward request to backend
}
```

Potential issues I suspect:

1. Register/Login routes are incorrectly using a protected proxy function.

   * They should not require an access token because users are not authenticated yet.
   * The proxy currently blocks requests when no access-token cookie exists.

2. Cookie names may not match:
   Backend:

   * accessToken
   * refreshToken

   Frontend expects:

   * access-token
   * gearup-refresh-token

3. Cookie configuration may fail in production:

   * Frontend and backend are different origins:

     * frontend.onrender.com
     * backend.onrender.com
   * sameSite:"lax" may prevent cookies from being sent.
   * Production probably requires:

     * secure:true
     * sameSite:"none"

4. CORS CLIENT_URL may be wrong because of trailing slash:

   Current:

   ```
   https://b7a5-frontend-gearup-1.onrender.com/
   ```

   Expected:

   ```
   https://b7a5-frontend-gearup-1.onrender.com
   ```

Tasks:

1. Analyze the authentication architecture.
2. Identify the exact reason why it works locally but fails on Render.
3. Explain whether the 500 error comes from frontend proxy or backend.
4. Suggest the minimal code changes required.
5. Provide corrected versions of:

   * frontend proxy handling for public auth routes
   * cookie configuration
   * cookie naming strategy
   * backend CORS configuration

Do not suggest changing the whole architecture. Keep the current Next.js proxy + Express backend design.

