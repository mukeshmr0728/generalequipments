# Architecture Overview

Visual guide to understand how the General Equipments platform works.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌────────────────────┐          ┌─────────────────────────┐  │
│  │   Public Website   │          │     Admin CMS Panel     │  │
│  │                    │          │                         │  │
│  │  - Homepage        │          │  - Login (/admin/login) │  │
│  │  - Products        │          │  - Dashboard            │  │
│  │  - Blog            │          │  - Products Manager     │  │
│  │  - Contact Form    │          │  - Blog Manager         │  │
│  │  - Book Call       │          │  - Leads Viewer         │  │
│  └────────┬───────────┘          └──────────┬──────────────┘  │
│           │                                  │                  │
└───────────┼──────────────────────────────────┼──────────────────┘
            │                                  │
            │ Form Submissions                 │ Auth & Admin Actions
            │                                  │
            ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                           │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Edge Functions  │  │  Authentication  │  │   Database   │ │
│  │                  │  │                  │  │              │ │
│  │  submit-lead  ───┼──┼──► JWT Tokens   │  │  Products    │ │
│  │  submit-booking  │  │    Sessions     │  │  Categories  │ │
│  │                  │  │    User Mgmt    │  │  Blog Posts  │ │
│  │  (Service Key)   │  │                  │  │  Leads       │ │
│  └──────────┬───────┘  └─────────┬────────┘  │  Bookings    │ │
│             │                    │           │  Settings    │ │
│             │                    │           └──────────────┘ │
│             │                    │                             │
│             └────────────────────┴──► Row Level Security (RLS) │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ Webhook (Optional)
                                ▼
                    ┌───────────────────────┐
                    │   Google Sheets       │
                    │   (CRM Backup)        │
                    └───────────────────────┘
```

## Authentication Flow

### 1. Admin Login Process

```
┌─────────────┐
│   Admin     │
│   visits    │
│ /admin/login│
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│  AdminLoginPage.tsx      │
│  - Shows login form      │
│  - Email + Password      │
└──────┬───────────────────┘
       │ User submits
       ▼
┌──────────────────────────┐
│  AuthContext             │
│  signIn(email, password) │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Supabase Auth API               │
│  signInWithPassword()            │
│  - Validates credentials         │
│  - Returns JWT tokens            │
│  - Access token (1 hour)         │
│  - Refresh token (7 days)        │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Success!                        │
│  - Tokens stored in localStorage │
│  - User object in AuthContext    │
│  - Redirect to /admin/dashboard  │
└──────────────────────────────────┘
```

### 2. Protected Route Access

```
┌─────────────┐
│   Admin     │
│  navigates  │
│  to admin   │
│    page     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│  ProtectedRoute.tsx      │
│  - Checks auth state     │
└──────┬───────────────────┘
       │
       ├─── Authenticated? ──► YES ──┐
       │                             │
       └─── Authenticated? ──► NO ───┤
                                     │
       ┌─────────────────────────────┘
       │
       ├─► YES: Render admin page (Outlet)
       │
       └─► NO:  Redirect to /admin/login
```

### 3. Session Management

```
┌────────────────────────────────────────┐
│  AuthContext (runs on app start)      │
│  useEffect(() => {                     │
│    supabase.auth.getSession()          │
│    supabase.auth.onAuthStateChange()   │
│  })                                    │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  Check for existing session            │
└────────────┬───────────────────────────┘
             │
             ├─► Found valid session
             │   └─► Set user in context
             │       └─► Auto-login
             │
             └─► No session or expired
                 └─► User stays logged out
                     └─► Must login manually
```

## Form Submission Flow

### Public Contact Form → Database

```
┌──────────────────┐
│  User fills form │
│  on website      │
│  (Contact/Book)  │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────┐
│  Form Component            │
│  - Validates input         │
│  - Shows loading state     │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  POST request to Edge Function     │
│  /functions/v1/submit-lead         │
│  OR                                │
│  /functions/v1/submit-booking      │
│                                    │
│  Headers:                          │
│  - Content-Type: application/json  │
│                                    │
│  Body:                             │
│  - name, email, phone, etc.        │
└────────┬───────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Edge Function (Server-side)            │
│  - Validates all input                  │
│  - Uses SERVICE_ROLE_KEY (secure)       │
│  - NOT exposed to frontend              │
└────────┬────────────────────────────────┘
         │
         ├──► INSERT into database
         │    └─► leads or booking_requests table
         │
         └──► POST to Google Sheets webhook (optional)
              └─► Backup in spreadsheet
```

## Data Access Patterns

### Admin Reading Data (Protected)

```
┌──────────────────┐
│  Admin logged in │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Admin Page (e.g., AdminLeadsPage) │
│  useEffect(() => {                 │
│    fetchLeads()                    │
│  })                                │
└────────┬───────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  supabase.from('leads').select()    │
│                                     │
│  - Sends JWT token automatically    │
│  - Token from AuthContext           │
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Supabase Database (RLS Check)      │
│                                      │
│  Policy:                             │
│  "Admins can read all leads"         │
│  TO authenticated                    │
│  USING (true)                        │
└────────┬─────────────────────────────┘
         │
         ├─► Authenticated? YES ──► Return data
         │
         └─► Authenticated? NO  ──► Return error 401
```

### Public Reading Data (Open)

```
┌──────────────────┐
│  Public visitor  │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────┐
│  ProductsPage.tsx                  │
│  - Loads products on mount         │
└────────┬───────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  supabase.from('products')              │
│    .select()                            │
│    .eq('is_active', true)               │
│                                         │
│  - Uses ANON_KEY (safe to expose)       │
│  - No authentication required           │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Supabase Database (RLS Check)          │
│                                          │
│  Policy:                                 │
│  "Anyone can read active products"       │
│  USING (is_active = true)                │
└────────┬─────────────────────────────────┘
         │
         └─► Return only active products
```

## Database Security: Row Level Security (RLS)

```
┌──────────────────────────────────────────────────┐
│              DATABASE TABLE                      │
│              (e.g., products)                    │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  Row Level Security (RLS) ENABLED      │    │
│  │                                         │    │
│  │  Policy 1: "Public can read active"    │    │
│  │  FOR SELECT                             │    │
│  │  USING (is_active = true)               │    │
│  │                                         │    │
│  │  Policy 2: "Admins can do everything"  │    │
│  │  FOR ALL                                │    │
│  │  TO authenticated                       │    │
│  │  USING (true)                           │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  Result:                                         │
│  ✓ Public users: Read active products only      │
│  ✓ Authenticated admins: Full CRUD access       │
│  ✗ Public users: Cannot insert/update/delete    │
│  ✗ Unauthenticated: Cannot see inactive items   │
└──────────────────────────────────────────────────┘
```

## Environment Variables

```
┌─────────────────────────────────────────┐
│  .env (NOT committed to git)            │
│                                         │
│  VITE_SUPABASE_URL=                     │
│    https://[project].supabase.co        │
│                                         │
│  VITE_SUPABASE_ANON_KEY=                │
│    eyJhbGci...                          │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  VITE_ prefix required!        │    │
│  │  Vite only exposes VITE_* vars │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Usage in code:                         │
│                                         │
│  import.meta.env.VITE_SUPABASE_URL      │
│  import.meta.env.VITE_SUPABASE_ANON_KEY │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│          LOCAL DEVELOPMENT                  │
│                                             │
│  npm run dev                                │
│  ├─► Vite Dev Server (Port 5173)           │
│  ├─► Hot Module Replacement                │
│  └─► Source maps for debugging             │
└─────────────────────────────────────────────┘
         │
         │ npm run build
         ▼
┌─────────────────────────────────────────────┐
│          PRODUCTION BUILD                   │
│                                             │
│  dist/                                      │
│  ├─► index.html                             │
│  ├─► assets/                                │
│  │   ├─► index-[hash].js  (493KB)          │
│  │   └─► index-[hash].css (33KB)           │
│  └─► _redirects (SPA routing)               │
└─────────────────────────────────────────────┘
         │
         │ Deploy
         ▼
┌─────────────────────────────────────────────┐
│          HOSTING PROVIDER                   │
│                                             │
│  Options:                                   │
│  ├─► Netlify                                │
│  ├─► Vercel                                 │
│  ├─► Cloudflare Pages                       │
│  └─► Any static hosting                     │
│                                             │
│  Configuration:                             │
│  └─► Add environment variables in UI        │
└─────────────────────────────────────────────┘
         │
         │ All API calls go to
         ▼
┌─────────────────────────────────────────────┐
│          SUPABASE (Hosted)                  │
│                                             │
│  ├─► Database (PostgreSQL)                  │
│  ├─► Authentication Service                 │
│  ├─► Edge Functions                         │
│  └─► Storage (if needed)                    │
└─────────────────────────────────────────────┘
```

## File Organization

```
src/
│
├── components/
│   ├── admin/          ← Admin-only components
│   │   ├── AdminLayout.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── forms/          ← Reusable form components
│   │   └── ProductInquiryForm.tsx
│   │
│   ├── home/           ← Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   └── ...
│   │
│   └── layout/         ← Site-wide layout
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
│
├── context/
│   └── AuthContext.tsx  ← Global auth state
│
├── lib/
│   └── supabase.ts      ← Supabase client
│
├── pages/
│   ├── admin/           ← Admin CMS pages
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   └── ...
│   │
│   └── [public pages]   ← Public website pages
│       ├── HomePage.tsx
│       ├── ProductsPage.tsx
│       └── ...
│
└── types/
    └── database.ts      ← TypeScript types
```

## Security Layers

```
┌────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                      │
│                                                        │
│  Layer 1: HTTPS                                        │
│  └─► All traffic encrypted in transit                 │
│                                                        │
│  Layer 2: Authentication (JWT)                         │
│  └─► Admin routes require valid token                 │
│                                                        │
│  Layer 3: Row Level Security (RLS)                     │
│  └─► Database enforces access rules                   │
│                                                        │
│  Layer 4: Edge Functions (Service Key)                 │
│  └─► Forms don't expose database directly             │
│                                                        │
│  Layer 5: Protected Routes                             │
│  └─► React Router guards admin pages                  │
│                                                        │
│  Layer 6: Environment Variables                        │
│  └─► Sensitive keys never in code                     │
└────────────────────────────────────────────────────────┘
```

## Request Flow Examples

### Example 1: Visitor Views Products

```
Browser → ProductsPage.tsx
       → supabase.from('products').select()
       → Supabase (checks RLS: is_active = true)
       → Returns active products
       → Display on page
```

### Example 2: Visitor Submits Contact Form

```
Browser → ContactPage.tsx
       → POST /functions/v1/submit-lead
       → Edge Function (validates data)
       → INSERT into leads table
       → POST to Google Sheets (optional)
       → Return success
       → Show success message
```

### Example 3: Admin Logs In

```
Browser → /admin/login
       → Enter email + password
       → supabase.auth.signInWithPassword()
       → Supabase validates credentials
       → Returns JWT tokens
       → Store in localStorage
       → Update AuthContext
       → Redirect to /admin/dashboard
```

### Example 4: Admin Views Leads

```
Browser → /admin/dashboard
       → ProtectedRoute checks auth (✓)
       → AdminDashboardPage.tsx
       → supabase.from('leads').select() + JWT token
       → Supabase (checks RLS: authenticated = true)
       → Returns all leads
       → Display in table
```

---

For step-by-step setup instructions, see:
- [QUICKSTART.md](./QUICKSTART.md)
- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
- [README.md](./README.md)
