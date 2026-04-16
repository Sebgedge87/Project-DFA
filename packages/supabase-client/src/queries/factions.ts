import { useQuery } from '@tanstack/react-query';
import { supabase } from '../client';
import type { Faction } from '@dfa/types';

export function useFactions() {
  return useQuery<Faction[]>({
    queryKey: ['factions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('factions')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as Faction[];
    },
    staleTime: 1000 * 60 * 60,
  });
}
