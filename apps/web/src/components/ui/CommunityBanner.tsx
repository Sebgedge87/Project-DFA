import { useNavigate } from 'react-router-dom';
import { useCommunityLists, useFavourites, useToggleFavourite } from '@dfa/supabase-client';
import { Download, Star } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export function CommunityBanner() {
  const { data: lists } = useCommunityLists(12);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: favs } = useFavourites(user?.id ?? null);
  const toggleFav = useToggleFavourite();

  if (!lists?.length) return null;

  const tiles = [...lists, ...lists];

  return (
    <div className="mb-6" aria-label="Top community armies">
      <p className="text-xs uppercase tracking-widest text-dfa-text-muted font-medium mb-3">
        Top Community Armies
      </p>

      {/* Marquee wrapper — faded edges */}
      <div
        className="overflow-hidden relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex gap-3 animate-marquee" style={{ width: 'max-content' }}>
          {tiles.map((list, i) => {
            const isDupe = i >= lists.length;
            const isFav = favs?.has(list.id) ?? false;
            const bgColor = list.faction?.color_primary ? `#${list.faction.color_primary}` : '#3A1A1A';

            return (
              <div
                key={`${list.id}-${i}`}
                aria-hidden={isDupe ? 'true' : undefined}
                tabIndex={-1}
                onClick={() => !isDupe && navigate(`/share/${list.share_token}`)}
                className="shrink-0 w-44 bg-dfa-surface border border-dfa-border-neutral rounded-lg overflow-hidden cursor-pointer hover:border-dfa-red/60 transition-colors"
              >
                {/* Cover image / colour swatch */}
                <div
                  className="h-24 w-full"
                  style={{ background: `linear-gradient(135deg, ${bgColor}55 0%, #0D0D0D 100%)` }}
                />

                {/* Info */}
                <div className="p-2.5">
                  <p className="text-dfa-text text-xs font-bold truncate leading-tight">{list.name}</p>
                  <p className="text-dfa-text-muted text-[11px] truncate mt-0.5">{list.faction?.name ?? ''}</p>
                  <p className="text-dfa-gold text-xs font-mono mt-1">{list.points_total}pts</p>

                  <div className="flex items-center gap-1.5 mt-2 text-dfa-text-muted">
                    <Download size={10} />
                    <span className="text-[11px]">{list.clone_count ?? 0}</span>

                    {user && !isDupe && (
                      <button
                        tabIndex={-1}
                        onClick={e => {
                          e.stopPropagation();
                          toggleFav.mutate({ userId: user.id, listId: list.id, isFav });
                        }}
                        aria-label={isFav ? 'Unfavourite' : 'Favourite'}
                        className={`ml-auto transition-colors ${isFav ? 'text-dfa-gold' : 'hover:text-dfa-gold'}`}
                      >
                        <Star size={10} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
