import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ujvtfrdkyflptxknmpma.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdnRmcmRreWZscHR4a25tcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDkwMjksImV4cCI6MjA3Njc4NTAyOX0.dHyqDtwRhFxUHcIKCixDgP4M1CBn0cktWiRPAfV9fSE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storageKey: 'earning-system-auth'
  }
});
