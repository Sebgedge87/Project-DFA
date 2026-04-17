import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@dfa/supabase-client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: (returnTo?: string) => Promise<void>;
  signInWithDiscord: (returnTo?: string) => Promise<void>;
  signInWithMagicLink: (email: string, returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, loading: false });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
    return () => subscription.unsubscribe();
  },

  signInWithGoogle: async (returnTo?: string) => {
    if (returnTo) sessionStorage.setItem('auth-return-to', returnTo);
    const base = `${window.location.origin}/auth`;
    const redirectTo = returnTo ? `${base}?returnTo=${encodeURIComponent(returnTo)}` : base;
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
  },

  signInWithDiscord: async (returnTo?: string) => {
    if (returnTo) sessionStorage.setItem('auth-return-to', returnTo);
    const base = `${window.location.origin}/auth`;
    const redirectTo = returnTo ? `${base}?returnTo=${encodeURIComponent(returnTo)}` : base;
    await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo } });
  },

  signInWithMagicLink: async (email: string, returnTo?: string) => {
    if (returnTo) sessionStorage.setItem('auth-return-to', returnTo);
    const base = `${window.location.origin}/auth`;
    const emailRedirectTo = returnTo ? `${base}?returnTo=${encodeURIComponent(returnTo)}` : base;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
