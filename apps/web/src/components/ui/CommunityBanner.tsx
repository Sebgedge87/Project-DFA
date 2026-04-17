import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunityLists, useFavourites, useToggleFavourite } from '@dfa/supabase-client';
import { Download, ExternalLink, Star } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export function CommunityBanner() {
  const { data: lists } = useCommunityLists(10);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: favs } = useFavourites(user?.id ?? null);
  const toggleFav = useToggleFavourite();

  useEffect(() => {
    if (!lists?.length) return;
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % lists.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lists?.length]);

  if (!lists?.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-widest text-dfa-text-muted font-medium">
          Top Community Armies
        </p>
        <div className="flex gap-1">
          {lists.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); if (timerRef.current) clearInterval(timerRef.current); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? 'bg-dfa-red' : 'bg-dfa-border'}`}
            />
          ))}
        </div>
      </div>

      {/* Scrolling strip */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {lists.map((list, i) => (
          <a
            key={list.id}
            href={`/share/${list.share_token}`}
            onClick={e => { e.preventDefault(); navigate(`/share/${list.share_token}`); }}
            className={`shrink-0 w-44 bg-dfa-surface border rounded-lg p-3 cursor-pointer transition-all ${
              i === active ? 'border-dfa-red shadow-sm shadow-dfa-red/20' : 'border-dfa-border'
            }`}
          >
            <p className="text-dfa-text text-xs font-bold truncate leading-tight">{list.name}</p>
            <p className="text-dfa-gold text-xs font-mono mt-1">{list.points_total}pts</p>
            <div className="flex items-center gap-1 mt-2 text-dfa-text-muted">
              <Download size={10} />
              <span className="text-[10px]">{list.clone_count ?? 0}</span>
              <div className="ml-auto flex items-center gap-1.5">
                {user && (
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFav.mutate({ userId: user.id, listId: list.id, isFav: favs?.has(list.id) ?? false });
                    }}
                    className={`transition-colors ${favs?.has(list.id) ? 'text-dfa-gold' : 'hover:text-dfa-gold'}`}
                    title={favs?.has(list.id) ? 'Unfavourite' : 'Favourite'}
                  >
                    <Star size={10} fill={favs?.has(list.id) ? 'currentColor' : 'none'} />
                  </button>
                )}
                <ExternalLink size={10} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
