/*
  # Fix Final Security Issues

  ## Changes Applied

  1. **Add Missing Foreign Key Index**
    - Add index for leads.product_id to improve query performance

  2. **Remove Unused Index**
    - Drop idx_product_categories_parent_id as it's not being used by queries

  3. **Improve Public Form Validation**
    - Replace "true" policies with validation checks
    - Ensure required fields are not empty/null
    - Add basic data validation to prevent spam submissions
    - Still allows public access but with data integrity checks

  ## Security Improvements

  For leads table:
  - Name must be provided (at least 2 characters)
  - Email must be provided (at least 3 characters, basic format)
  - Company must be provided (at least 1 character)

  For booking_requests table:
  - Name must be provided (at least 2 characters)
  - Email must be provided (at least 3 characters, basic format)
  - Preferred date must be provided
  - Cannot book dates in the past

  These checks prevent completely empty submissions while maintaining
  public access to the contact forms.
*/

-- =====================================================
-- 1. ADD MISSING FOREIGN KEY INDEX
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_leads_product_id ON leads(product_id);

-- =====================================================
-- 2. REMOVE UNUSED INDEX
-- =====================================================

DROP INDEX IF EXISTS idx_product_categories_parent_id;

-- =====================================================
-- 3. IMPROVE LEADS INSERT POLICY WITH VALIDATION
-- =====================================================

DROP POLICY IF EXISTS "Public can submit leads" ON leads;

CREATE POLICY "Public can submit leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (
    -- Ensure required fields are provided
    name IS NOT NULL AND length(trim(name)) >= 2
    AND email IS NOT NULL AND length(trim(email)) >= 3 AND email LIKE '%@%'
    AND company IS NOT NULL AND length(trim(company)) >= 1
  );

-- =====================================================
-- 4. IMPROVE BOOKING REQUESTS INSERT POLICY WITH VALIDATION
-- =====================================================

DROP POLICY IF EXISTS "Public can submit booking requests" ON booking_requests;

CREATE POLICY "Public can submit booking requests"
  ON booking_requests
  FOR INSERT
  TO public
  WITH CHECK (
    -- Ensure required fields are provided
    name IS NOT NULL AND length(trim(name)) >= 2
    AND email IS NOT NULL AND length(trim(email)) >= 3 AND email LIKE '%@%'
    AND preferred_date IS NOT NULL AND preferred_date >= CURRENT_DATE
  );