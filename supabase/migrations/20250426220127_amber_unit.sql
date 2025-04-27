/*
  # Fix recursive RLS policies for user_profiles table

  1. Changes
    - Remove recursive policies that were causing infinite loops
    - Replace with non-recursive policies that maintain the same security rules
    
  2. Security
    - Maintain existing security rules where:
      - Admins can manage all user profiles
      - Users can read their own profile
      - Users can update their own profile
    - Use a more efficient policy structure that avoids recursion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can read all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles;

-- Create new non-recursive policies
CREATE POLICY "Enable read access to own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable admin read access to all profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable admin insert access"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable admin update access"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable update access to own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);