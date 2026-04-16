import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useArmyStore } from '../../stores/armyStore';
import BuilderPage from '../builder/[faction]';

// Loads a saved list into the army store then delegates to the builder UI
export default function ListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listId, loadList } = useArmyStore();

  // Load if not already loaded
  if (id && listId !== id) {
    loadList(id).catch(() => navigate('/lists'));
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-dfa-text-muted text-sm animate-pulse">Loading army…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-dfa-border bg-dfa-surface">
        <button
          onClick={() => navigate('/lists')}
          className="text-dfa-text-muted hover:text-dfa-text transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-dfa-text-muted text-sm">My Armies</span>
      </div>
      <BuilderPage />
    </div>
  );
}
