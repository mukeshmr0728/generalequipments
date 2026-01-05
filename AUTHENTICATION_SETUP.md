# Authentication Setup Guide

This guide explains how to set up and use Supabase authentication for the General Equipments CMS admin panel.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Creating Admin Users](#creating-admin-users)
4. [Accessing the Admin Panel](#accessing-the-admin-panel)
5. [How Authentication Works](#how-authentication-works)
6. [Security Features](#security-features)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

---

## Overview

The General Equipments website uses **Supabase Authentication** for secure admin access to the CMS. This provides:

- Email/password authentication
- Secure session management
- Automatic token refresh
- Protected admin routes
- Built-in security features

**Important**: Only authenticated users can access the admin panel at `/admin/*` routes.

---

## Architecture

### Authentication Flow

```
┌─────────────────┐
│   Admin Login   │
│   (/admin/login)│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext (React Context)│
│  - Manages user session     │
│  - Handles sign in/out      │
│  - Monitors auth state      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Supabase Auth Service      │
│  - Validates credentials    │
│  - Issues JWT tokens        │
│  - Manages sessions         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Protected Routes           │
│  (/admin/dashboard, etc.)   │
│  - Verify authentication    │
│  - Redirect if not logged in│
└─────────────────────────────┘
```

### Key Components

1. **AuthContext** (`src/context/AuthContext.tsx`)
   - Provides authentication state throughout the app
   - Manages user sessions
   - Handles sign in/out operations

2. **AdminLoginPage** (`src/pages/admin/AdminLoginPage.tsx`)
   - Login form for admin users
   - Email/password validation
   - Error handling

3. **ProtectedRoute** (`src/components/admin/ProtectedRoute.tsx`)
   - Guards admin routes
   - Redirects unauthenticated users to login

4. **Supabase Client** (`src/lib/supabase.ts`)
   - Configured with your Supabase project credentials
   - Uses environment variables for security

---

## Creating Admin Users

### Method 1: Using Supabase Dashboard (Recommended)

This is the easiest and most secure method.

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `urvnpiquycoorthpmhnb`

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Create a New User**
   - Click the "Add User" button
   - Choose "Create new user"
   - Enter the admin email address (e.g., `admin@generalequipments.com`)
   - Enter a secure password (minimum 6 characters)
   - Toggle "Auto Confirm User" to ON (important!)
   - Click "Create User"

4. **User is Ready**
   - The admin user is now created and can log in immediately
   - No email confirmation is required (since we toggled Auto Confirm)

### Method 2: Using Supabase SQL Editor

If you prefer SQL, you can create users directly:

1. Go to SQL Editor in your Supabase Dashboard
2. Run this query:

```sql
-- Create an admin user
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
  'admin@generalequipments.com', -- Change this to your admin email
  crypt('YourSecurePassword123!', gen_salt('bf')), -- Change this password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  ''
);
```

**Note**: Replace `admin@generalequipments.com` and `YourSecurePassword123!` with your desired credentials.

### Method 3: Using Sign Up Form (Development Only)

For development purposes, you can temporarily create a sign-up page:

**Important**: DO NOT deploy a public sign-up form to production. This would allow anyone to create admin accounts!

---

## Accessing the Admin Panel

### Step 1: Navigate to Login Page

Open your browser and go to:
```
http://localhost:5173/admin/login
```

Or on production:
```
https://yourdomain.com/admin/login
```

### Step 2: Enter Credentials

- Enter the admin email address you created
- Enter the password
- Click "Sign In"

### Step 3: Access Admin Dashboard

After successful login, you'll be redirected to:
```
/admin/dashboard
```

From there, you can access all admin features:
- **Dashboard** - Overview and statistics
- **Products** - Manage product catalog
- **Blog** - Manage blog posts
- **Leads** - View and manage customer inquiries
- **Bookings** - View and manage call bookings
- **Settings** - Site configuration

---

## How Authentication Works

### 1. Initial Page Load

When the app loads, `AuthContext` checks for an existing session:

```typescript
// Automatically runs on app start
supabase.auth.getSession()
```

If a valid session exists, the user is automatically logged in.

### 2. Sign In Process

When a user submits the login form:

```typescript
// Step 1: User enters credentials
email: "admin@generalequipments.com"
password: "YourSecurePassword123!"

// Step 2: Submit to Supabase
supabase.auth.signInWithPassword({ email, password })

// Step 3: Supabase validates credentials
// - Checks if user exists
// - Verifies password hash
// - Issues JWT access token
// - Issues refresh token

// Step 4: Session is stored
// - Tokens stored in localStorage
// - User object available in AuthContext
// - User redirected to /admin/dashboard
```

### 3. Protected Route Access

Every admin route is protected:

```typescript
// User tries to access /admin/dashboard
↓
ProtectedRoute checks authentication
↓
If authenticated: Render admin page
If not authenticated: Redirect to /admin/login
```

### 4. Session Management

- **Access Token**: Valid for 1 hour (default)
- **Refresh Token**: Valid for 7 days (default)
- **Auto-Refresh**: Tokens automatically refresh before expiry
- **Logout**: Clears all tokens and session data

### 5. Sign Out Process

When a user signs out:

```typescript
// Step 1: User clicks "Sign Out"
supabase.auth.signOut()

// Step 2: Tokens are cleared
// - localStorage cleared
// - Session terminated
// - User state set to null

// Step 3: Redirect to login
navigate('/admin/login')
```

---

## Security Features

### 1. Password Security

- Passwords are hashed using bcrypt
- Minimum 6 characters required (can be increased)
- Passwords never stored in plain text
- Passwords never sent to frontend

### 2. Token-Based Authentication

- JWT tokens used for API authentication
- Access tokens expire after 1 hour
- Refresh tokens used for automatic renewal
- Tokens stored securely in localStorage

### 3. Protected Routes

- All `/admin/*` routes require authentication
- Automatic redirect to login if not authenticated
- No direct database access from frontend forms
- Row Level Security (RLS) policies on all tables

### 4. Session Security

- Sessions automatically expire
- Concurrent session management
- Logout clears all session data
- HTTPS recommended for production

### 5. Environment Variables

```bash
# Stored in .env file (never committed to git)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Important**: The anon key is safe to expose to the frontend because:
- It only allows public database operations defined by RLS policies
- Admin operations require authentication
- Edge Functions use the service role key (not exposed)

---

## Troubleshooting

### Problem: "Invalid email or password"

**Possible Causes:**
1. Incorrect email or password
2. User not created in Supabase
3. Email not confirmed

**Solutions:**
1. Verify credentials in Supabase Dashboard
2. Check that user exists in Authentication > Users
3. Ensure "Email Confirmed" is checked for the user
4. Reset password in Supabase Dashboard if needed

### Problem: Redirected to login after signing in

**Possible Causes:**
1. Session not being stored
2. Browser blocking localStorage
3. Supabase configuration issue

**Solutions:**
1. Check browser console for errors
2. Verify environment variables are set correctly:
   ```bash
   VITE_SUPABASE_URL=https://urvnpiquycoorthpmhnb.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Clear browser cache and localStorage
4. Try in incognito/private mode
5. Check Supabase project status in dashboard

### Problem: Session expires too quickly

**Solution:**
Configure session duration in Supabase Dashboard:
1. Go to Authentication > Settings
2. Find "JWT Expiry"
3. Increase "Access Token Expiry" (default: 3600 seconds)
4. Increase "Refresh Token Expiry" (default: 604800 seconds)

### Problem: Can't access Supabase Dashboard

**Solutions:**
1. Verify you're logged into the correct Supabase account
2. Your project URL: https://supabase.com/dashboard/project/urvnpiquycoorthpmhnb
3. If you've lost access, contact Supabase support

### Problem: Environment variables not found

**Error**: `Cannot read properties of undefined`

**Solutions:**
1. Verify `.env` file exists in project root
2. Restart development server after changing `.env`:
   ```bash
   npm run dev
   ```
3. Check variable names start with `VITE_`:
   ```bash
   VITE_SUPABASE_URL=...  ✓ Correct
   SUPABASE_URL=...       ✗ Wrong
   ```

---

## Advanced Configuration

### Customizing Session Duration

Edit in Supabase Dashboard > Authentication > Settings:

```
Access Token Expiry: 3600 seconds (1 hour)
Refresh Token Expiry: 604800 seconds (7 days)
```

For longer sessions (e.g., "Remember Me" functionality), increase these values.

### Adding Email Confirmation

Currently, email confirmation is disabled for simplicity. To enable:

1. **Enable Email Confirmations**
   - Go to Authentication > Settings
   - Toggle "Enable Email Confirmations" ON

2. **Configure Email Templates**
   - Go to Authentication > Email Templates
   - Customize the "Confirm Signup" template

3. **Update User Creation**
   - Remove "Auto Confirm User" toggle when creating users
   - Users will receive confirmation email

### Adding Password Reset

To add password reset functionality:

1. **Create Password Reset Page**
   ```typescript
   // src/pages/admin/PasswordResetPage.tsx
   const handleReset = async (email: string) => {
     const { error } = await supabase.auth.resetPasswordForEmail(email, {
       redirectTo: 'http://localhost:5173/admin/reset-password-confirm',
     });
   };
   ```

2. **Configure Email Template**
   - Go to Authentication > Email Templates
   - Customize "Reset Password" template

### Adding Multi-Factor Authentication (MFA)

For enhanced security, enable MFA in Supabase Dashboard:

1. Go to Authentication > Settings
2. Toggle "Enable MFA" ON
3. Update login flow to handle MFA challenges

### Managing Multiple Admin Roles

To implement role-based access:

1. **Add Roles to User Metadata**
   ```sql
   -- Update user with custom role
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     raw_user_meta_data,
     '{role}',
     '"super_admin"'
   )
   WHERE email = 'admin@generalequipments.com';
   ```

2. **Check Roles in Frontend**
   ```typescript
   const { user } = useAuth();
   const userRole = user?.user_metadata?.role;

   if (userRole === 'super_admin') {
     // Show additional features
   }
   ```

---

## Quick Reference

### Admin Login URL
- **Development**: http://localhost:5173/admin/login
- **Production**: https://yourdomain.com/admin/login

### Default Test Credentials
```
Email: admin@generalequipments.com
Password: (Set during user creation)
```

### Supabase Dashboard
- **Project URL**: https://supabase.com/dashboard/project/urvnpiquycoorthpmhnb
- **Direct Link**: https://supabase.com/dashboard

### Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for TypeScript errors
npm run typecheck
```

---

## Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Include uppercase, lowercase, numbers, symbols
   - Use a password manager

2. **Limit Admin Accounts**
   - Create only necessary admin users
   - Review user list regularly
   - Remove inactive accounts

3. **Enable HTTPS in Production**
   - Never use HTTP for login pages
   - Supabase requires HTTPS for auth

4. **Keep Dependencies Updated**
   ```bash
   npm update @supabase/supabase-js
   ```

5. **Monitor Authentication Logs**
   - Check Supabase Dashboard > Authentication > Logs
   - Watch for failed login attempts
   - Set up alerts for suspicious activity

6. **Backup Recovery**
   - Store admin credentials securely
   - Have multiple admin accounts
   - Know your Supabase account recovery email

---

## Support

If you encounter issues not covered in this guide:

1. **Check Supabase Status**: https://status.supabase.com/
2. **Supabase Documentation**: https://supabase.com/docs/guides/auth
3. **Community Support**: https://github.com/supabase/supabase/discussions
4. **Project-Specific Issues**: Check the main README.md

---

## Summary

Your authentication system is fully configured and ready to use:

- ✅ Supabase Auth configured
- ✅ Admin login page at `/admin/login`
- ✅ Protected admin routes
- ✅ Secure session management
- ✅ Row Level Security on database

**Next Steps:**
1. Create your first admin user in Supabase Dashboard
2. Log in at http://localhost:5173/admin/login
3. Start managing your content!
