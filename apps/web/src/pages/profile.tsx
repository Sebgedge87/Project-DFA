import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { useMyLists, useDeleteList } from '@dfa/supabase-client';
import { useAuthStore } from '../stores/authStore';
import { useArmyStore } from '../stores/armyStore';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: lists, isLoading } = useMyLists(user?.id ?? null);
  const deleteList = useDeleteList();
  const { loadList } = useArmyStore();
  const navigate = useNavigate();

  const handleLoad = async (id: string) => {
    await loadList(id);
    navigate(`/list/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this army list?')) deleteList.mutate(id);
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">
            My Armies
          </h1>
          <p className="text-dfa-text-muted text-xs mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
        >
          <Plus size={15} />
          New Army
        </button>
      </div>

      {isLoading ? (
        <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">
          Loading your armies…
        </div>
      ) : lists?.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-dfa-text-muted text-sm">No saved armies yet.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
          >
            Build your first army
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lists?.map((list) => (
            <div
              key={list.id}
              className="bg-dfa-surface border border-dfa-border rounded-lg p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-dfa-text font-medium truncate">{list.name}</p>
                <p className="text-xs text-dfa-text-muted mt-0.5">
                  <span className="text-dfa-gold font-mono font-bold">{list.points_total}pts</span>
                  {' · '}
                  {list.is_public ? 'Public' : 'Private'}
                  {' · '}
                  {new Date(list.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {list.is_public && (
                  <a
                    href={`/share/${list.share_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dfa-text-muted hover:text-dfa-text transition-colors"
                    title="View share link"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => handleLoad(list.id)}
                  className="px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(list.id)}
                  className="text-dfa-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
