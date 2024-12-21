/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Add new comprehensive RLS policies for profiles table
    - Enable proper profile creation and access

  2. Security
    - Allow users to read their own profile
    - Allow users to update their own profile
    - Allow profile creation for new users
    - Maintain data isolation between users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access to own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert access for users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access to own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow the trigger function to bypass RLS
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;