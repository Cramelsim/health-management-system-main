/*
  # Update default user passwords

  1. Changes
    - Updates passwords for existing default users to match the login form
    - Ensures passwords are properly hashed
    - Maintains existing user IDs and roles

  2. Security
    - Uses secure password hashing with bcrypt
    - Preserves existing user data
*/

DO $$
DECLARE
  admin_email text := 'admin@health.com';
  doctor_email text := 'doctor@health.com';
BEGIN
  -- Update admin password
  UPDATE auth.users
  SET encrypted_password = crypt('admin123', gen_salt('bf'))
  WHERE email = admin_email;

  -- Update doctor password
  UPDATE auth.users
  SET encrypted_password = crypt('doctor123', gen_salt('bf'))
  WHERE email = doctor_email;
END $$;