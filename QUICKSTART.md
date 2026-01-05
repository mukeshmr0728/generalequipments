# Quick Start Guide

Get your General Equipments CMS up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Your Supabase project is already configured

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages for the application.

## Step 2: Start Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:5173**

## Step 3: Create Your First Admin User

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `urvnpiquycoorthpmhnb`
3. Click **Authentication** in the sidebar
4. Click **Users** tab
5. Click **Add User** button
6. Fill in:
   - **Email**: `admin@yourdomain.com`
   - **Password**: Create a secure password
   - **Toggle "Auto Confirm User"**: ON (important!)
7. Click **Create User**

### Option B: Using SQL Editor

1. Go to **SQL Editor** in your Supabase Dashboard
2. Run this query (replace email and password):

```sql
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@yourdomain.com',
  crypt('YourSecurePassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  ''
);
```

## Step 4: Access the Admin Panel

1. Open your browser
2. Go to: **http://localhost:5173/admin/login**
3. Enter your admin credentials
4. Click **Sign In**

You'll be redirected to the admin dashboard at `/admin/dashboard`

## Step 5: Explore the CMS

Once logged in, you can access:

- **Dashboard** - View statistics and recent activity
- **Products** - Manage your product catalog
- **Blog** - Create and manage blog posts
- **Leads** - View customer inquiries
- **Bookings** - Manage consultation requests
- **Settings** - Configure site settings

## Testing the Public Site

Visit these URLs to see the public-facing site:

- **Homepage**: http://localhost:5173/
- **Products**: http://localhost:5173/products
- **Blog**: http://localhost:5173/blog
- **About**: http://localhost:5173/about
- **Contact**: http://localhost:5173/contact
- **Book a Call**: http://localhost:5173/book-call

## Common Issues

### Issue: "Invalid email or password"

**Solution**:
- Verify the email and password you created
- Check that "Email Confirmed" is checked in Supabase Dashboard
- Make sure you toggled "Auto Confirm User" ON when creating the user

### Issue: Environment variables error

**Solution**:
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

The `.env` file is already configured with your Supabase credentials.

### Issue: Can't access admin pages

**Solution**:
- Make sure you're logged in at `/admin/login`
- Check browser console for errors
- Clear browser cache and try again

## Next Steps

1. **Review the full documentation**:
   - [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Complete auth guide
   - [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Connect to Google Sheets
   - [README.md](./README.md) - Full project documentation

2. **Customize your content**:
   - Add your products in the admin panel
   - Write blog posts
   - Update site settings

3. **Deploy to production**:
   ```bash
   npm run build
   ```
   Then deploy the `dist/` folder to your hosting provider.

## Support

For detailed help with any feature, refer to the complete documentation:

- **Authentication Issues**: [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
- **Google Sheets Setup**: [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
- **Project Overview**: [README.md](./README.md)

---

**You're all set!** Start managing your industrial equipment website through the admin panel at `/admin/login`.
