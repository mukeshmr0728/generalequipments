/*
  # Fix Security Issues

  ## Critical Security Fixes

  1. **Admin Role Check Function**
    - Creates helper function to verify admin status from user metadata
    - Checks auth.jwt() -> 'app_metadata' -> 'role' = 'admin'

  2. **RLS Policy Fixes**
    - Replace overly permissive policies (USING true) with proper admin checks
    - Remove multiple overlapping policies
    - Maintain public INSERT for contact forms (leads, booking_requests)
    - Restrict all management operations to admin users only

  3. **Index Optimization**
    - Add missing index for leads.product_id foreign key
    - Remove unused indexes that provide no query benefit

  ## Tables Updated

  - `leads`: Fixed admin-only access for SELECT/UPDATE/DELETE
  - `booking_requests`: Fixed admin-only access for SELECT/UPDATE/DELETE
  - `blog_posts`: Fixed admin-only management, consolidated SELECT policies
  - `products`: Fixed admin-only management, consolidated SELECT policies
  - `product_categories`: Fixed admin-only management, consolidated SELECT policies
  - `site_settings`: Fixed admin-only management, public SELECT remains

  ## Security Notes

  - Public users can only INSERT leads and booking requests (contact forms)
  - Only users with app_metadata.role = 'admin' can manage data
  - Public SELECT access restricted to published/active content only
  - Admin users must be created with proper metadata in Supabase Auth
*/

-- =====================================================
-- 1. CREATE ADMIN CHECK FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. FIX LEADS TABLE
-- =====================================================

-- Add missing foreign key index
CREATE INDEX IF NOT EXISTS idx_leads_product_id ON leads(product_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_leads_status;
DROP INDEX IF EXISTS idx_leads_created;
DROP INDEX IF EXISTS idx_leads_inquiry_type;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON leads;

-- Create new secure policies
CREATE POLICY "Public can submit leads"
  ON leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================
-- 3. FIX BOOKING REQUESTS TABLE
-- =====================================================

-- Drop unused indexes
DROP INDEX IF EXISTS idx_booking_requests_status;
DROP INDEX IF EXISTS idx_booking_requests_date;
DROP INDEX IF EXISTS idx_booking_requests_created;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit booking requests" ON booking_requests;
DROP POLICY IF EXISTS "Authenticated users can view bookings" ON booking_requests;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON booking_requests;
DROP POLICY IF EXISTS "Authenticated users can delete bookings" ON booking_requests;

-- Create new secure policies
CREATE POLICY "Public can submit booking requests"
  ON booking_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
  ON booking_requests
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update bookings"
  ON booking_requests
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete bookings"
  ON booking_requests
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================
-- 4. FIX BLOG POSTS TABLE
-- =====================================================

-- Drop all existing policies (removes duplication)
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON blog_posts;

-- Create new consolidated policies
CREATE POLICY "Public can view published posts"
  ON blog_posts
  FOR SELECT
  USING (is_published = true AND publish_date <= now());

CREATE POLICY "Admins can manage all posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- 5. FIX PRODUCTS TABLE
-- =====================================================

-- Drop unused indexes
DROP INDEX IF EXISTS idx_products_slug;
DROP INDEX IF EXISTS idx_products_featured;
DROP INDEX IF EXISTS idx_products_active;

-- Drop all existing policies (removes duplication)
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Create new consolidated policies
CREATE POLICY "Public can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all products"
  ON products
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- 6. FIX PRODUCT CATEGORIES TABLE
-- =====================================================

-- Drop unused indexes
DROP INDEX IF EXISTS idx_product_categories_slug;
DROP INDEX IF EXISTS idx_product_categories_parent;

-- Drop all existing policies (removes duplication)
DROP POLICY IF EXISTS "Anyone can view active categories" ON product_categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON product_categories;

-- Create new consolidated policies
CREATE POLICY "Public can view active categories"
  ON product_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all categories"
  ON product_categories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- 7. FIX SITE SETTINGS TABLE
-- =====================================================

-- Drop all existing policies (removes duplication)
DROP POLICY IF EXISTS "Anyone can view settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON site_settings;

-- Create new consolidated policies
CREATE POLICY "Public can view all settings"
  ON site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());