import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';

export function useFavourites(userId: string | null) {
  return useQuery<Set<string>>({
    queryKey: ['favourites', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favourites')
        .select('list_id')
        .eq('user_id', userId!);
      if (error) throw error;
      return new Set((data ?? []).map((r: any) => r.list_id as string));
    },
  });
}

export function useToggleFavourite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, listId, isFav }: { userId: string; listId: string; isFav: boolean }) => {
      if (isFav) {
        const { error } = await supabase.from('favourites').delete().match({ user_id: userId, list_id: listId });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('favourites').insert({ user_id: userId, list_id: listId } as any);
        if (error) throw error;
      }
    },
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['favourites', userId] });
    },
  });
}
