import { createClient } from '@supabase/supabase-js';
import type { Database } from '@dfa/types';

// Environment variables are provided by each consuming app
// Web:    VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// Mobile: EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = (
  typeof import.meta !== 'undefined'
    ? (import.meta as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL
    : process.env.EXPO_PUBLIC_SUPABASE_URL
) ?? '';

const supabaseAnonKey = (
  typeof import.meta !== 'undefined'
    ? (import.meta as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY
    : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
) ?? '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
