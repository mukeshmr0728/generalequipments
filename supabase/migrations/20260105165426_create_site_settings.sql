/*
  # Create Site Settings Table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique setting key)
      - `value` (text, setting value - can store JSON strings)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage settings
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO site_settings (key, value) VALUES
  ('company_name', 'General Equipments'),
  ('company_tagline', 'Industrial Excellence, Engineered Solutions'),
  ('company_phone', '+1 (555) 123-4567'),
  ('company_email', 'info@generalequipments.com'),
  ('company_address', '1234 Industrial Boulevard, Manufacturing District, TX 75001'),
  ('social_instagram', 'https://instagram.com/generalequipments'),
  ('social_whatsapp', 'https://wa.me/15551234567'),
  ('social_twitter', 'https://twitter.com/genequipments'),
  ('social_linkedin', 'https://linkedin.com/company/generalequipments'),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.8!2d-96.8!3d32.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU0JzAwLjAiTiA5NsKwNDgnMDAuMCJX!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus')
ON CONFLICT (key) DO NOTHING;