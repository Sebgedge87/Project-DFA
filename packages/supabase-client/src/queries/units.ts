import { useQuery } from '@tanstack/react-query';
import { supabase } from '../client';
import type { UnitType } from '@dfa/types';

export function useUnitTypes(factionId: string | null) {
  return useQuery<UnitType[]>({
    queryKey: ['unit_types', factionId],
    enabled: !!factionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unit_types')
        .select(`
          *,
          unit_weapons (
            weapon: weapons (
              *,
              weapon_keywords (
                keyword: keywords (*),
                parameter
              )
            )
          )
        `)
        .eq('faction_id', factionId!)
        .order('sort_order');
      if (error) throw error;
      return (data ?? []).map((u: any) => ({
        ...u,
        weapons: u.unit_weapons?.map((uw: any) => uw.weapon) ?? [],
        unit_weapons: undefined,
      })) as UnitType[];
    },
    staleTime: 1000 * 60 * 60,
  });
}
