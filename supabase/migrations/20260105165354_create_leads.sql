/*
  # Create Leads Table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, contact name)
      - `email` (text, contact email)
      - `phone` (text, contact phone)
      - `company` (text, company name)
      - `inquiry_type` (text, type of inquiry)
      - `source_page` (text, which page the lead came from)
      - `message` (text, inquiry message)
      - `product_id` (uuid, optional reference to product)
      - `status` (text, lead status for tracking)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for public to insert leads (form submissions)
    - Add policy for authenticated admin users to view and manage leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  inquiry_type text DEFAULT 'general',
  source_page text,
  message text,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_inquiry_type ON leads(inquiry_type);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads"
  ON leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (true);