/*
  # Create meditation sessions table

  1. New Tables
    - `meditation_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `duration` (integer, in seconds)
      - `mood` (text)
      - `rating` (integer, 1-5)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `meditation_sessions` table
    - Add policies for authenticated users to:
      - Read their own sessions
      - Create new sessions
*/

CREATE TABLE IF NOT EXISTS meditation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  duration integer NOT NULL,
  mood text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON meditation_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON meditation_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);