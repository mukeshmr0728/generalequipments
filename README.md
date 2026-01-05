# General Equipments - Industrial B2B Platform

A professional, full-stack industrial equipment supplier website built with modern web technologies. This platform serves as a comprehensive solution for B2B sales, featuring product catalogs, blog management, lead capture, and a complete admin CMS.

## 📖 Documentation

**[View All Documentation](./DOCS_INDEX.md)** - Complete documentation index with quick links

### Essential Guides:
- **[Quick Start Guide](./QUICKSTART.md)** - Get started in 5 minutes
- **[Architecture Overview](./ARCHITECTURE.md)** - Visual diagrams showing how everything works
- **[Authentication Setup Guide](./AUTHENTICATION_SETUP.md)** - Complete guide for setting up admin authentication and accessing the CMS
- **[Google Sheets Integration](./GOOGLE_SHEETS_SETUP.md)** - Step-by-step instructions for connecting contact forms to Google Sheets

## 🏗️ Technology Stack

### Frontend
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling with custom industrial theme
- **React Hook Form** - Form state management
- **Lucide React** - Icon system
- **Date-fns** - Date formatting utilities

### Backend & Database
- **Supabase** - PostgreSQL database with authentication
- **Supabase Edge Functions** - Serverless API endpoints
- **Row Level Security (RLS)** - Database-level security

### Infrastructure
- **Vite** - Build tool and dev server
- **TypeScript** - Type checking
- **ESLint** - Code linting

## 📁 Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin dashboard components
│   │   │   ├── AdminLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── forms/              # Form components
│   │   │   └── ProductInquiryForm.tsx
│   │   ├── home/               # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── ValuePropsSection.tsx
│   │   │   ├── IndustriesSection.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── StatsSection.tsx
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Layout.tsx
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── lib/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── pages/
│   │   ├── admin/              # Admin pages
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── AdminProductsPage.tsx
│   │   │   ├── AdminBlogPage.tsx
│   │   │   ├── AdminLeadsPage.tsx
│   │   │   ├── AdminBookingsPage.tsx
│   │   │   └── AdminSettingsPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── BlogPage.tsx
│   │   ├── BlogDetailPage.tsx
│   │   ├── BookCallPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── PrivacyPolicyPage.tsx
│   │   └── TermsPage.tsx
│   ├── types/
│   │   └── database.ts         # TypeScript database types
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
├── supabase/
│   ├── functions/              # Edge Functions
│   │   ├── submit-lead/
│   │   └── submit-booking/
│   └── migrations/             # Database migrations
│       ├── create_product_categories.sql
│       ├── create_products.sql
│       ├── create_blog_posts.sql
│       ├── create_leads.sql
│       ├── create_booking_requests.sql
│       ├── create_site_settings.sql
│       └── seed_initial_data.sql
├── public/
│   └── favicon.svg
├── .env                        # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (database already provisioned)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   The `.env` file is already configured with:
   ```env
   VITE_SUPABASE_URL=https://[your-project-id].supabase.co
   VITE_SUPABASE_ANON_KEY=[your-anon-key]
   ```

3. **Database Setup:**
   All database migrations have been applied. The database includes:
   - Product categories and products
   - Blog posts
   - Leads and booking requests
   - Site settings
   - Sample data for testing

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access the site at `http://localhost:5173`

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 🔐 Security Architecture

### Supabase Edge Functions

All form submissions (leads, bookings, product inquiries) are processed through **Supabase Edge Functions** using the **service role key** for secure server-side database operations. This architecture ensures:

- **No direct database access from frontend**
- **Server-side validation** of all submissions
- **Secure credential handling**
- **Protection against SQL injection**
- **Rate limiting** at the edge function level

### Edge Functions Deployed:

1. **submit-lead** (`/functions/v1/submit-lead`)
   - Handles contact forms and product inquiries
   - Validates input data
   - Stores leads in database
   - Sends data to Google Sheets (if configured)

2. **submit-booking** (`/functions/v1/submit-booking`)
   - Handles booking/consultation requests
   - Validates input data
   - Stores bookings in database
   - Sends data to Google Sheets (if configured)

### Authentication

- **Admin access**: Supabase Authentication (email/password)
- **Protected routes**: React Router with AuthContext
- **Session management**: Automatic token refresh
- **Admin path**: `/admin/login`

📖 **For detailed authentication setup and usage, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)**

## 📊 Database Schema

### Tables

#### product_categories
- Product category management with hierarchy support
- Fields: id, name, slug, description, image_url, display_order, parent_id, is_active

#### products
- Full product catalog with specifications
- Fields: id, name, slug, category_id, short_description, full_description (HTML), specifications (JSON), featured_image, gallery_images, is_featured, is_active
- Supports HTML content for technical documentation

#### blog_posts
- Technical blog content management
- Fields: id, title, slug, excerpt, content (HTML), featured_image, author, publish_date, is_published, meta_title, meta_description
- SEO-optimized with meta fields

#### leads
- All inquiry types (contact, product, general)
- Fields: id, name, email, phone, company, inquiry_type, source_page, message, product_id, status

#### booking_requests
- Consultation/call booking requests
- Fields: id, name, email, phone, company, preferred_date, preferred_time, topic, message, status

#### site_settings
- Configurable site settings
- Fields: id, key, value
- Stores company info, social links, contact details

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- **Public read** for active content (products, blog posts)
- **Public insert** for leads and bookings (via edge functions)
- **Authenticated access** for admin operations

## 🔗 Google Sheets Integration

### Setup Instructions

1. **Create a Google Sheet** for lead tracking

2. **Set up Google Sheets API or Apps Script Webhook:**

   **Option A: Using Apps Script (Recommended)**

   a. Open your Google Sheet
   b. Extensions → Apps Script
   c. Create new script:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);

     sheet.appendRow([
       data.timestamp,
       data.type || 'lead',
       data.name,
       data.email,
       data.phone,
       data.company,
       data.inquiry_type || data.topic,
       data.source_page,
       data.message,
       data.product_id || '',
       data.preferred_date || '',
       data.preferred_time || ''
     ]);

     return ContentService.createTextOutput(JSON.stringify({success: true}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
   d. Deploy → New deployment → Web app
   e. Set "Execute as" to your account
   f. Set "Who has access" to "Anyone"
   g. Copy the deployment URL

3. **Configure the Webhook in Supabase:**

   The edge functions automatically use the `GOOGLE_SHEETS_WEBHOOK_URL` environment variable.
   Contact your Supabase admin to set this variable in the project settings.

4. **Sheet Column Headers:**
   ```
   | Timestamp | Type | Name | Email | Phone | Company | Inquiry Type | Source Page | Message | Product ID | Preferred Date | Preferred Time |
   ```

### How It Works

When a form is submitted:
1. Frontend calls Edge Function
2. Edge Function validates data
3. Edge Function stores in Supabase database
4. Edge Function sends to Google Sheets webhook
5. Both operations complete successfully or rollback

## 🎨 Design System

### Color Palette

```css
/* Charcoal (Primary Dark) */
charcoal-950: #1a1a1a
charcoal-900: #3d3d3d
charcoal-700: #4f4f4f
charcoal-500: #6d6d6d
charcoal-300: #b0b0b0
charcoal-100: #e7e7e7

/* Steel (Primary Blue) */
steel-700: #3b526b
steel-600: #456382
steel-500: #567a99
steel-400: #7696b1
steel-300: #a3bacd
steel-100: #e2eaf0

/* Industrial (Accent) */
industrial-600: #ca8a04
industrial-500: #eab308
industrial-400: #facc15
```

### Typography

- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, tight tracking, line-height 1.2
- **Body**: Line-height 1.5 (150%)
- **All uppercase labels**: Semibold, wider tracking

### Components

All custom Tailwind classes are defined in `src/index.css`:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`
- `.input-field`, `.label`
- `.container-wide`, `.section-padding`
- `.prose-industrial` (for rendered HTML content)

## 📱 Pages Overview

### Public Pages

- **/** - Homepage with hero, categories, value props, industries, trust signals
- **/about** - Company overview, mission, values, certifications
- **/products** - Product catalog with category filtering
- **/products/category/:slug** - Category-specific product listings
- **/products/:slug** - Individual product detail pages
- **/blog** - Blog listing page
- **/blog/:slug** - Individual blog post pages
- **/book-a-call** - Consultation booking form
- **/contact** - General contact form
- **/privacy-policy** - Privacy policy
- **/terms-and-conditions** - Terms and conditions

### Admin Pages

- **/admin/login** - Admin authentication
- **/admin/dashboard** - Overview with stats and recent activity
- **/admin/products** - Product management (CRUD)
- **/admin/blog** - Blog post management (CRUD)
- **/admin/leads** - Lead viewing and status management
- **/admin/bookings** - Booking request management
- **/admin/settings** - Site configuration

## 🔧 Development

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

### Adding New Products

1. Log in to admin at `/admin/login`
2. Navigate to Products
3. Click "Add Product"
4. Fill in product details (HTML supported in descriptions)
5. Publish

### Adding Blog Posts

1. Log in to admin
2. Navigate to Blog Posts
3. Click "New Post"
4. Write content (HTML supported)
5. Set publish date and status

### Managing Leads

1. Navigate to Admin → Leads
2. View all submissions
3. Update status (new → contacted → qualified → closed)
4. All data is also in Google Sheets (if configured)

## 🌐 Deployment

### Build and Deploy

```bash
# Build the production version
npm run build

# Deploy the dist/ folder to your hosting provider
# (Vercel, Netlify, AWS Amplify, etc.)
```

### Environment Variables for Production

Ensure these are set in your hosting provider:
```env
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### Edge Functions

Edge functions are already deployed to Supabase. No additional deployment needed.

## 📧 Form Submissions

All forms submit to secure edge functions:

1. **Contact Form** → `/functions/v1/submit-lead`
2. **Product Inquiry** → `/functions/v1/submit-lead`
3. **Book a Call** → `/functions/v1/submit-booking`

Data is stored in:
- Supabase database (primary)
- Google Sheets (backup/CRM)

## 🔒 Admin Access

To create an admin user:

1. Go to Supabase Dashboard
2. Authentication → Users
3. Add new user with email/password
4. User can now log in at `/admin/login`

## 🎯 Features

### Public Website
✅ Professional industrial design
✅ Product catalog with categories
✅ Full HTML support for technical content
✅ Blog with rich content
✅ Lead capture forms
✅ Booking/consultation scheduling
✅ Google Maps integration
✅ Social media links
✅ Mobile responsive
✅ SEO optimized

### Admin CMS
✅ Secure authentication
✅ Product management
✅ Blog management
✅ Lead tracking and status management
✅ Booking request management
✅ Site settings configuration
✅ Dashboard with analytics

### Security
✅ Server-side form processing
✅ Row Level Security (RLS)
✅ Protected admin routes
✅ Service key for sensitive operations
✅ Input validation

### Integrations
✅ Google Sheets for lead backup
✅ Supabase for database and auth
✅ Edge functions for serverless API

## 📞 Support

For technical support or questions about this platform, please refer to:
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com

## 📄 License

This project is proprietary software for General Equipments.

---

**Built with precision for industrial excellence** 🏭
