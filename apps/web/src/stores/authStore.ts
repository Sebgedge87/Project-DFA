// Authentication state — Supabase session management
import { create } from 'zustand';

export const useAuthStore = create()(() => ({
  user: null,
  session: null,
}));
