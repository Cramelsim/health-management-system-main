/*
  # Insert default users
  
  1. Creates default admin and doctor users
  2. Sets up initial user profiles
*/

-- Insert default admin user (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@health.com'
  ) THEN
    -- Insert admin user to auth.users
    INSERT INTO auth.users (
      id, email, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, 
      is_super_admin, created_at, updated_at, last_sign_in_at
    ) VALUES (
      gen_random_uuid(), 'admin@health.com', NOW(), 
      '{"name":"Admin User"}', 
      '{"provider":"email","providers":["email"]}',
      FALSE, NOW(), NOW(), NOW()
    );
    
    -- Set password for admin user
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf'))
    WHERE email = 'admin@health.com';
    
    -- Insert admin user profile
    INSERT INTO user_profiles (id, role)
    SELECT id, 'admin' FROM auth.users WHERE email = 'admin@health.com';
  END IF;
END
$$;

-- Insert default doctor user (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'doctor@health.com'
  ) THEN
    -- Insert doctor user to auth.users
    INSERT INTO auth.users (
      id, email, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, 
      is_super_admin, created_at, updated_at, last_sign_in_at
    ) VALUES (
      gen_random_uuid(), 'doctor@health.com', NOW(), 
      '{"name":"Doctor User"}', 
      '{"provider":"email","providers":["email"]}',
      FALSE, NOW(), NOW(), NOW()
    );
    
    -- Set password for doctor user
    UPDATE auth.users
    SET encrypted_password = crypt('doctor123', gen_salt('bf'))
    WHERE email = 'doctor@health.com';
    
    -- Insert doctor user profile
    INSERT INTO user_profiles (id, role)
    SELECT id, 'doctor' FROM auth.users WHERE email = 'doctor@health.com';
  END IF;
END
$$;