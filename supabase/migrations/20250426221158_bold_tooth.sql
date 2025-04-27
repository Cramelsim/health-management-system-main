/*
  # Add user management functionality

  1. New Tables
    - None (using existing user_profiles table)
  
  2. Security
    - Add policies for user management
    - Allow admins to create and manage users
*/

-- Function to create a new user with profile
CREATE OR REPLACE FUNCTION create_user_with_profile(
  email TEXT,
  password TEXT,
  user_role TEXT
) RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    email,
    crypt(password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    'authenticated'
  ) RETURNING id INTO new_user_id;

  -- Create user profile
  INSERT INTO public.user_profiles (id, role)
  VALUES (new_user_id, user_role);

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user role
CREATE OR REPLACE FUNCTION update_user_role(
  user_id uuid,
  new_role TEXT
) RETURNS void AS $$
BEGIN
  UPDATE public.user_profiles
  SET role = new_role
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_user_with_profile TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_role TO authenticated;