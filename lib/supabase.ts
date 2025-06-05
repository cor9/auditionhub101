import { createClient } from '@supabase/supabase-js';

// These values will be populated by the Supabase connection dialog
let supabaseUrl = '';
let supabaseAnonKey = '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function initializeSupabase(url: string, key: string) {
  supabaseUrl = url;
  supabaseAnonKey = key;
  return createClient(url, key);
}