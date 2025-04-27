/*
  # Create or update default users

  1. Changes
    - Creates default admin and doctor users if they don't exist
    - Updates corresponding user profiles
    - Ensures role values are properly set
    
  2. Security
    - Uses secure password hashing
    - Maintains existing RLS policies
*/

DO $$
DECLARE
  admin_id uuid := 'a96eb5c6-7710-4bc5-9902-52dc32fb9344';
  doctor_id uuid := 'b96eb5c6-7710-4bc5-9902-52dc32fb9345';
  admin_email text := 'admin@health.com';
  doctor_email text := 'doctor@health.com';
  admin_exists boolean;
  doctor_exists boolean;
  existing_admin_id uuid;
  existing_doctor_id uuid;
BEGIN
  -- Get existing user IDs by email
  SELECT id INTO existing_admin_id FROM auth.users WHERE email = admin_email;
  SELECT id INTO existing_doctor_id FROM auth.users WHERE email = doctor_email;
  
  -- Check if users exist
  admin_exists := existing_admin_id IS NOT NULL;
  doctor_exists := existing_doctor_id IS NOT NULL;

  -- Create admin user if email doesn't exist
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
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      admin_email,
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
    VALUES (admin_id, 'admin');
  ELSE
    -- Update existing admin profile
    INSERT INTO public.user_profiles (id, role)
    VALUES (existing_admin_id, 'admin')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin';
  END IF;

  -- Create doctor user if email doesn't exist
  IF NOT doctor_exists THEN
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
      doctor_id,
      '00000000-0000-0000-0000-000000000000',
      doctor_email,
      crypt('doctor123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      false,
      'authenticated'
    );

    -- Create doctor profile
    INSERT INTO public.user_profiles (id, role)
    VALUES (doctor_id, 'doctor');
  ELSE
    -- Update existing doctor profile
    INSERT INTO public.user_profiles (id, role)
    VALUES (existing_doctor_id, 'doctor')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'doctor';
  END IF;
END $$;