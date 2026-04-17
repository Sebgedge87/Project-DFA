import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateAddUnit, calculatePoints } from '@dfa/logic';
import { supabase } from '@dfa/supabase-client';
import type { Faction, UnitType, ArmyEntry, ValidationResult } from '@dfa/types';

interface ArmyState {
  listId: string | null;
  listName: string;
  faction: Faction | null;
  entries: ArmyEntry[];
  isDirty: boolean;
  isSaving: boolean;
  _hasHydrated: boolean;
  _setHasHydrated: (v: boolean) => void;
  setFaction: (faction: Faction) => void;
  addUnit: (unit: UnitType) => ValidationResult;
  removeUnit: (entryId: string) => void;
  setQuantity: (entryId: string, qty: number) => void;
  setName: (name: string) => void;
  saveList: (isPublic?: boolean) => Promise<void>;
  loadList: (id: string) => Promise<void>;
  resetArmy: () => void;
}

export const useArmyStore = create<ArmyState>()(
  persist(
    (set, get) => ({
      listId: null,
      listName: 'My Army',
      faction: null,
      entries: [],
      isDirty: false,
      isSaving: false,
      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),

      setFaction: (faction) => {
        localStorage.removeItem('dfa-walkthrough-dismissed');
        set({ faction, entries: [], isDirty: false, listId: null });
      },

      addUnit: (unit) => {
        const result = validateAddUnit(get().entries, unit);
        if (result.ok) {
          set((s) => {
            const existing = s.entries.find((e) => e.unit_type.id === unit.id);
            if (existing) {
              return {
                entries: s.entries.map((e) =>
                  e.unit_type.id === unit.id ? { ...e, quantity: e.quantity + 1 } : e,
                ),
                isDirty: true,
              };
            }
            return {
              entries: [...s.entries, { id: crypto.randomUUID(), unit_type: unit, quantity: 1 }],
              isDirty: true,
            };
          });
        }
        return result;
      },

      removeUnit: (entryId) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== entryId), isDirty: true })),

      setQuantity: (entryId, qty) =>
        set((s) => ({
          entries:
            qty <= 0
              ? s.entries.filter((e) => e.id !== entryId)
              : s.entries.map((e) => (e.id === entryId ? { ...e, quantity: qty } : e)),
          isDirty: true,
        })),

      setName: (name) => set({ listName: name, isDirty: true }),

      saveList: async (isPublic = false) => {
        const { listId, listName, faction, entries } = get();
        if (!faction) return;
        set({ isSaving: true });
        try {
          const pointsTotal = calculatePoints(entries);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          const { data: list, error: listErr } = await supabase
            .from('army_lists')
            .upsert(
              { id: listId ?? undefined, name: listName, faction_id: faction.id, points_total: pointsTotal, is_public: isPublic, user_id: user.id } as any,
              { onConflict: 'id' },
            )
            .select()
            .single();
          if (listErr) throw listErr;
          const { error: delErr } = await supabase.from('army_entries').delete().eq('army_list_id', list.id);
          if (delErr) throw delErr;
          if (entries.length > 0) {
            const { error: entriesErr } = await supabase.from('army_entries').insert(
              entries.map((e) => ({ army_list_id: list.id, unit_type_id: e.unit_type.id, quantity: e.quantity })),
            );
            if (entriesErr) throw entriesErr;
          }
          set({ listId: list.id, isDirty: false });
        } finally {
          set({ isSaving: false });
        }
      },

      loadList: async (id) => {
        const { data, error } = await supabase
          .from('army_lists')
          .select(`*, faction: factions(*), army_entries(id, quantity, unit_type: unit_types(*, unit_weapons(weapon: weapons(*, weapon_keywords(keyword: keywords(*), parameter)))))`)
          .eq('id', id)
          .single();
        if (error) throw error;
        const entries: ArmyEntry[] = (data.army_entries ?? []).map((e: any) => ({
          id: e.id,
          quantity: e.quantity,
          unit_type: {
            ...e.unit_type,
            weapons: e.unit_type?.unit_weapons?.map((uw: any) => uw.weapon) ?? [],
            unit_weapons: undefined,
          },
        }));
        set({ listId: data.id, listName: data.name, faction: data.faction, entries, isDirty: false });
      },

      resetArmy: () =>
        set({ listId: null, listName: 'My Army', faction: null, entries: [], isDirty: false }),
    }),
    {
      name: 'dfa-army-draft',
      partialize: (state) => ({
        listId:   state.listId,
        listName: state.listName,
        faction:  state.faction,
        entries:  state.entries,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
