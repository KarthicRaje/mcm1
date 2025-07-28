
import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../src/config';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_URL')) {
  throw new Error("Supabase URL and Anon Key are not configured. Please edit src/config.ts and replace placeholder values with your actual Supabase credentials.");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
