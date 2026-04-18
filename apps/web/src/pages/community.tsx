import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Download, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@dfa/supabase-client';

type SortKey = 'newest' | 'oldest' | 'popular';

interface PublicList {
  id: string;
  name: string;
  points_total: number;
  share_token: string;
  faction_id: string;
  clone_count: number;
  updated_at: string;
  faction: { name: string; color_primary: string } | null;
}

function useAllPublicLists() {
  return useQuery<PublicList[]>({
    queryKey: ['public_lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select('id, name, points_total, share_token, faction_id, clone_count, updated_at, faction: factions(name, color_primary)')
        .eq('is_public', true)
        .order('updated_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as unknown as PublicList[];
    },
    staleTime: 1000 * 60 * 3,
  });
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most Popular' },
];

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [factionId, setFactionId] = useState<string | null>(null);

  const { data: allLists, isLoading, error } = useAllPublicLists();

  // Derive unique factions from loaded lists
  const factions = useMemo(() => {
    if (!allLists) return [];
    const seen = new Set<string>();
    return allLists
      .filter(l => {
        if (!l.faction || seen.has(l.faction_id)) return false;
        seen.add(l.faction_id);
        return true;
      })
      .map(l => ({ id: l.faction_id, ...l.faction! }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allLists]);

  // Client-side filter + sort
  const filtered = useMemo(() => {
    if (!allLists) return [];
    let result = [...allLists];

    const q = search.trim().toLowerCase();
    if (q) result = result.filter(l => l.name.toLowerCase().includes(q));
    if (factionId) result = result.filter(l => l.faction_id === factionId);

    if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    } else if (sort === 'popular') {
      result.sort((a, b) => (b.clone_count ?? 0) - (a.clone_count ?? 0) || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    // 'newest' is already sorted by query

    return result;
  }, [allLists, search, factionId, sort]);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">
          Community Armies
        </h1>
        <p className="text-dfa-text-muted text-xs mt-1">
          Publicly shared army lists from the Death Fields Arena community.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dfa-text-muted pointer-events-none" aria-hidden="true" />
        <label htmlFor="community-search" className="sr-only">Search armies</label>
        <input
          id="community-search"
          type="text"
          placeholder="Search armies…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-dfa-surface border border-dfa-border-neutral rounded pl-8 pr-8 py-2 text-sm text-dfa-text placeholder-dfa-text-muted focus:outline-none focus:border-dfa-red"
        />
        {search && (
          <button onClick={() => setSearch('')} aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dfa-text-muted hover:text-dfa-text">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Faction filter chips */}
      {factions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setFactionId(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
              factionId === null
                ? 'bg-dfa-red border-dfa-red text-white'
                : 'border-dfa-border text-dfa-text-muted hover:text-dfa-text'
            }`}
          >
            All Factions
          </button>
          {factions.map(f => {
            const active = factionId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFactionId(active ? null : f.id)}
                className="shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors"
                style={active
                  ? { background: `#${f.color_primary}`, borderColor: `#${f.color_primary}`, color: 'white' }
                  : { borderColor: `#${f.color_primary}44`, color: `#${f.color_primary}` }
                }
              >
                {f.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Sort controls + result count */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors ${
                sort === s.value
                  ? 'bg-dfa-surface-raised border-dfa-border text-dfa-text'
                  : 'border-transparent text-dfa-text-muted hover:text-dfa-text'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {!isLoading && (
          <p className="text-xs text-dfa-text-muted shrink-0">
            {filtered.length} {filtered.length === 1 ? 'army' : 'armies'}
          </p>
        )}
      </div>

      {/* States */}
      {isLoading && (
        <div className="text-dfa-text-muted text-sm animate-pulse py-12 text-center">
          Loading armies…
        </div>
      )}
      {error && (
        <p className="text-red-400 text-sm py-8 text-center">Failed to load community lists.</p>
      )}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <Users size={40} className="mx-auto text-dfa-border" />
          <p className="text-dfa-text-muted text-sm">
            {search || factionId ? 'No armies match your filters.' : 'No public armies yet.'}
          </p>
          {!search && !factionId && (
            <p className="text-dfa-text-muted text-xs">Save an army and make it public to appear here.</p>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListCard({ list }: { list: PublicList }) {
  const color = list.faction?.color_primary ?? '8B1A1A';
  const ago = formatAgo(list.updated_at);

  return (
    <div className="bg-dfa-surface border border-dfa-border-neutral rounded-lg overflow-hidden flex flex-col hover:border-dfa-text-muted/40 transition-colors">
      {/* Faction colour bar */}
      <div className="h-1" style={{ background: `#${color}` }} />

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          {/* Faction dot */}
          <span
            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
            style={{ background: `#${color}` }}
          />
          <p className="text-dfa-text font-bold leading-snug truncate">{list.name}</p>
        </div>

        <p className="text-xs text-dfa-text-muted pl-4">
          {list.faction?.name ?? 'Unknown Faction'}
        </p>

        <div className="flex items-center gap-3 pl-4">
          <span className="text-dfa-gold font-mono font-bold text-sm">{list.points_total}pts</span>
          {(list.clone_count ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-dfa-text-muted">
              <Download size={11} />
              {list.clone_count}
            </span>
          )}
          <span className="text-xs text-dfa-text-muted ml-auto">{ago}</span>
        </div>

        <Link
          to={`/share/${list.share_token}`}
          className="mt-auto block w-full text-center py-1.5 border border-dfa-border-neutral text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted text-xs rounded transition-colors"
        >
          View Army
        </Link>
      </div>
    </div>
  );
}

function formatAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
