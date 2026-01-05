/*
  # Create Booking Requests Table

  1. New Tables
    - `booking_requests`
      - `id` (uuid, primary key)
      - `name` (text, contact name)
      - `email` (text, contact email)
      - `phone` (text, contact phone)
      - `company` (text, company name)
      - `preferred_date` (date, requested call date)
      - `preferred_time` (text, requested time slot)
      - `topic` (text, discussion topic)
      - `message` (text, additional details)
      - `status` (text, booking status)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `booking_requests` table
    - Add policy for public to insert booking requests
    - Add policy for authenticated admin users to manage bookings
*/

CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  preferred_date date,
  preferred_time text,
  topic text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_date ON booking_requests(preferred_date);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created ON booking_requests(created_at);

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit booking requests"
  ON booking_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view bookings"
  ON booking_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON booking_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON booking_requests
  FOR DELETE
  TO authenticated
  USING (true);