/*
  # Add new admin account

  1. New Users
    - Add new admin user with email craigcarlos95@gmail.com
  
  2. Security
    - Password is hashed using bcrypt
    - Email is confirmed automatically
*/

DO $$
DECLARE
  new_admin_id uuid := gen_random_uuid();
  new_admin_email text := 'craigcarlos95@gmail.com';
  admin_exists boolean;
BEGIN
  -- Check if admin already exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = new_admin_email
  ) INTO admin_exists;

  -- Create new admin user if doesn't exist
  IF NOT admin_exists THEN
    INSERT INTO auth.users (
      id,
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
      new_admin_id,
      '00000000-0000-0000-0000-000000000000',
      new_admin_email,
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      false,
      'authenticated'
    );

    -- Create admin profile
    INSERT INTO public.user_profiles (id, role)
    VALUES (new_admin_id, 'admin');
  END IF;
END $$;