import { createClient } from '@supabase/supabase-js';

// These will come from environment variables in a real deployment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'doctor';
  created_at: string;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
};

export type Client = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string | null;
  address: string;
  created_at: string;
  created_by: string;
};

export type Enrollment = {
  id: string;
  client_id: string;
  program_id: string;
  enrollment_date: string;
  status: 'active' | 'completed' | 'terminated';
  created_at: string;
  created_by: string;
};

export type ClientWithPrograms = Client & {
  programs: (Program & { enrollment_id: string; enrollment_status: string; enrollment_date: string })[];
};