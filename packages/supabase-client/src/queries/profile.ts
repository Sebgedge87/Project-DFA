import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type { Profile } from '@dfa/types';

export function useProfile(userId: string | null) {
  return useQuery<Profile | null>({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single();
      if (error) return null;
      return data as Profile;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<Pick<Profile, 'username' | 'display_name' | 'bio' | 'discord_id' | 'has_completed_walkthrough'>>;
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates as any)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (profile) => {
      qc.invalidateQueries({ queryKey: ['profile', profile.id] });
    },
  });
}
