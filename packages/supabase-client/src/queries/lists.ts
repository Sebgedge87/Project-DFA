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

      // Increment clone count on source list
      await supabase
        .from('army_lists')
        .update({ clone_count: (t.clone_count ?? 0) + 1 } as any)
        .eq('id', templateId);

      return list.id as string;
    },
    onSuccess: (_id, { userId }) => {
      qc.invalidateQueries({ queryKey: ['army_lists', userId] });
      qc.invalidateQueries({ queryKey: ['community_lists'] });
    },
  });
}

export function useCommunityLists(limit = 10) {
  return useQuery({
    queryKey: ['community_lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select('id, name, points_total, share_token, faction_id, clone_count, updated_at, faction:factions(color_primary, name)')
        .eq('is_public', true)
        .order('clone_count', { ascending: false })
        .order('updated_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as unknown as (ArmyList & { faction: { color_primary: string; name: string } | null })[];
    },
    staleTime: 1000 * 60 * 5,
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
