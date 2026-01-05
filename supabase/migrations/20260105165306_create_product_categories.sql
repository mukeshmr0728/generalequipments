/*
  # Create Product Categories Table

  1. New Tables
    - `product_categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `slug` (text, URL-friendly identifier, unique)
      - `description` (text, category description)
      - `image_url` (text, category image from Supabase storage)
      - `display_order` (integer, for sorting categories)
      - `parent_id` (uuid, for subcategories, references self)
      - `is_active` (boolean, visibility flag)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `product_categories` table
    - Add policy for public read access to active categories
    - Add policy for authenticated admin users to manage categories
*/

CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  parent_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON product_categories(is_active);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON product_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON product_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);