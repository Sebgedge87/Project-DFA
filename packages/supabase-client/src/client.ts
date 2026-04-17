import { createClient } from '@supabase/supabase-js';
import type { Database } from '@dfa/types';

// Environment variables are provided by each consuming app
// Web:    VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// Mobile: EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY
const env = (import.meta as any).env ?? (globalThis as any).process?.env ?? {};

const supabaseUrl: string = env.VITE_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey: string = env.VITE_SUPABASE_ANON_KEY ?? env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
