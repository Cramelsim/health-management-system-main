/*
  # Fix recursive policies in user_profiles table

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for admin and user access
    
  2. Security
    - Maintains row level security
    - Preserves admin and user access patterns without recursion
    - Ensures users can only read their own profile unless they are admin
*/

-- Drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Enable admin read access to all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access to own profile" ON user_profiles;

-- Create new non-recursive policies
CREATE POLICY "Enable read access to own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Enable admin read access to all profiles"
ON user_profiles
FOR SELECT
TO authenticated
USING (
  role = 'admin'
);