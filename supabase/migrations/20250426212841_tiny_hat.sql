/*
  # Initial schema setup for health information system
  
  1. New Tables
    - `user_profiles` - Stores user profile data (admins/doctors)
    - `programs` - Health programs such as TB, Malaria, HIV, etc.
    - `clients` - Patients/clients registered in the system
    - `enrollments` - Tracks clients enrolled in health programs
  
  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated users
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  contact_number TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES programs ON DELETE CASCADE NOT NULL,
  enrollment_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'terminated')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL,
  UNIQUE(client_id, program_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Admins can read all user profiles"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
) OR auth.uid() = id);

CREATE POLICY "Admins can insert user profiles"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
));

CREATE POLICY "Admins can update user profiles"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
) OR auth.uid() = id)
WITH CHECK (auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
) OR auth.uid() = id);

-- Create RLS policies for programs
CREATE POLICY "Authenticated users can read programs"
ON programs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert programs"
ON programs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update their programs"
ON programs
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
))
WITH CHECK (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
));

-- Create RLS policies for clients
CREATE POLICY "Authenticated users can read clients"
ON clients
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert clients"
ON clients
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update clients"
ON clients
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
))
WITH CHECK (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
));

-- Create RLS policies for enrollments
CREATE POLICY "Authenticated users can read enrollments"
ON enrollments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert enrollments"
ON enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update enrollments"
ON enrollments
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
))
WITH CHECK (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM user_profiles WHERE role = 'admin'
));