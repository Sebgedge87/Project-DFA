// UI state — modals, drawers, active faction, etc.
import { create } from 'zustand';

export const useUiStore = create()(() => ({
  sidebarOpen: false,
  activeModal: null as string | null,
}));
