import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Supabase features will not be available.');
}

export const supabase = createClient(
  supabaseUrl || 'https://qfbtqvxymfugtpcceqha.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYnRxdnh5bWZ1Z3RwY2NlcWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTY0MTcsImV4cCI6MjA2ODgzMjQxN30.4Np6ke2888Rl6VnSSriKlTO7a_j59IrL-YKWEjih6qI'
);
