/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `slug` (text, URL-friendly identifier, unique)
      - `category_id` (uuid, references product_categories)
      - `short_description` (text, brief product summary)
      - `full_description` (text, full HTML content for technical specs)
      - `specifications` (jsonb, structured technical specifications)
      - `featured_image` (text, main product image URL)
      - `gallery_images` (jsonb, array of additional image URLs)
      - `is_featured` (boolean, show on homepage)
      - `is_active` (boolean, visibility flag)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to active products
    - Add policy for authenticated admin users to manage products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  short_description text,
  full_description text,
  specifications jsonb DEFAULT '{}',
  featured_image text,
  gallery_images jsonb DEFAULT '[]',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);