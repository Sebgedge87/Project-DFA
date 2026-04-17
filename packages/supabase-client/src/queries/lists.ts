import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type { ArmyEntry, ArmyList } from '@dfa/types';

export function useMyLists(userId: string | null) {
  return useQuery<ArmyList[]>({
    queryKey: ['army_lists', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select('*')
        .eq('user_id', userId!)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as ArmyList[];
    },
  });
}

export function useList(id: string | null) {
  return useQuery({
    queryKey: ['army_list', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select(`
          *,
          army_entries (
            id,
            quantity,
            unit_type: unit_types (
              *,
              unit_weapons (
                weapon: weapons (
                  *,
                  weapon_keywords ( keyword: keywords (*), parameter )
                )
              )
            )
          )
        `)
        .eq('id', id!)
        .single();
      if (error) throw error;
      const d = data as any;
      return {
        ...d,
        army_entries: (d.army_entries ?? []).map((e: any) => ({
          id: e.id,
          quantity: e.quantity,
          unit_type: {
            ...e.unit_type,
            weapons: e.unit_type?.unit_weapons?.map((uw: any) => uw.weapon) ?? [],
            unit_weapons: undefined,
          },
        })) as ArmyEntry[],
      };
    },
  });
}

export function useShareList(token: string | null) {
  return useQuery({
    queryKey: ['share_list', token],
    enabled: !!token,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select(`
          *,
          faction: factions (*),
          army_entries (
            id,
            quantity,
            unit_type: unit_types (
              *,
              unit_weapons (
                weapon: weapons (
                  *,
                  weapon_keywords ( keyword: keywords (*), parameter )
                )
              )
            )
          )
        `)
        .eq('share_token', token!)
        .eq('is_public', true)
        .single();
      if (error) throw error;
      const d = data as any;
      return {
        ...d,
        army_entries: (d.army_entries ?? []).map((e: any) => ({
          id: e.id,
          quantity: e.quantity,
          unit_type: {
            ...e.unit_type,
            weapons: e.unit_type?.unit_weapons?.map((uw: any) => uw.weapon) ?? [],
            unit_weapons: undefined,
          },
        })) as ArmyEntry[],
      };
    },
  });
}

export function useSaveList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listId,
      listName,
      factionId,
      entries,
      isPublic = false,
    }: {
      listId: string | null;
      listName: string;
      factionId: string;
      entries: ArmyEntry[];
      isPublic?: boolean;
    }) => {
      const pointsTotal = entries.reduce(
        (sum, e) => sum + e.unit_type.points * e.quantity,
        0,
      );
      const { data: listRaw, error: listErr } = await supabase
        .from('army_lists')
        .upsert(
          { id: listId ?? undefined, name: listName, faction_id: factionId, points_total: pointsTotal, is_public: isPublic } as any,
          { onConflict: 'id' },
        )
        .select()
        .single();
      if (listErr) throw listErr;
      const list = listRaw as any;

      await supabase.from('army_entries').delete().eq('army_list_id', list.id);
      const { error: entriesErr } = await supabase.from('army_entries').insert(
        entries.map((e) => ({
          army_list_id: list.id,
          unit_type_id: e.unit_type.id,
          quantity: e.quantity,
        })),
      );
      if (entriesErr) throw entriesErr;
      return list as ArmyList;
    },
    onSuccess: (list) => {
      qc.invalidateQueries({ queryKey: ['army_lists', list.user_id] });
      qc.invalidateQueries({ queryKey: ['army_list', list.id] });
    },
  });
}

export function useTemplateLists() {
  return useQuery<ArmyList[]>({
    queryKey: ['template_lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select('*')
        .eq('is_template', true)
        .order('name');
      if (error) throw error;
      return data as ArmyList[];
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useCloneList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ templateId, userId }: { templateId: string; userId: string }) => {
      // Fetch template + entries
      const { data: tmpl, error: tmplErr } = await supabase
        .from('army_lists')
        .select('*, army_entries(unit_type_id, quantity)')
        .eq('id', templateId)
        .single();
      if (tmplErr) throw tmplErr;
      const t = tmpl as any;

      // Create new list for this user
      const { data: newList, error: listErr } = await supabase
        .from('army_lists')
        .insert({ name: t.name, faction_id: t.faction_id, points_total: t.points_total, is_public: false, user_id: userId } as any)
        .select()
        .single();
      if (listErr) throw listErr;
      const list = newList as any;

      // Copy entries
      if (t.army_entries?.length) {
        const { error: entriesErr } = await supabase.from('army_entries').insert(
          t.army_entries.map((e: any) => ({
            army_list_id: list.id,
            unit_type_id: e.unit_type_id,
            quantity: e.quantity,
          })),
        );
        if (entriesErr) throw entriesErr;
      }
      return list.id as string;
    },
    onSuccess: (_id, { userId }) => {
      qc.invalidateQueries({ queryKey: ['army_lists', userId] });
    },
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('army_lists').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['army_lists'] });
    },
  });
}
