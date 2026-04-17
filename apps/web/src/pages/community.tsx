import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@dfa/supabase-client';
import type { ArmyList } from '@dfa/types';

function usePublicLists() {
  return useQuery<(ArmyList & { faction: { name: string; color_primary: string } | null })[]>({
    queryKey: ['public_lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select('*, faction: factions(name, color_primary)')
        .eq('is_public', true)
        .order('updated_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as any;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export default function CommunityPage() {
  const { data: lists, isLoading, error } = usePublicLists();

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">
          Community Armies
        </h1>
        <p className="text-dfa-text-muted text-xs mt-1">
          Publicly shared army lists from the Death Fields Arena community.
        </p>
      </div>

      {isLoading && (
        <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">
          Loading armies…
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm py-8 text-center">
          Failed to load community lists.
        </p>
      )}

      {!isLoading && lists?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-dfa-text-muted text-sm">No public armies yet.</p>
          <p className="text-dfa-text-muted text-xs mt-1">
            Save an army and make it public to be featured here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {lists?.map((list) => (
          <div
            key={list.id}
            className="bg-dfa-surface border border-dfa-border rounded-lg p-4 flex items-center gap-4"
          >
            {list.faction && (
              <div
                className="w-2 self-stretch rounded-full shrink-0"
                style={{ background: `#${list.faction.color_primary}` }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-dfa-text font-medium truncate">{list.name}</p>
              <p className="text-xs text-dfa-text-muted mt-0.5">
                {list.faction?.name ?? 'Unknown Faction'}
                {' · '}
                <span className="text-dfa-gold font-mono font-bold">{list.points_total}pts</span>
              </p>
            </div>
            <Link
              to={`/share/${list.share_token}`}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors shrink-0"
            >
              <ExternalLink size={13} />
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
