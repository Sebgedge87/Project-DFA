import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArmyStore } from '../../stores/armyStore';

export default function ListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listId, loadList } = useArmyStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { navigate('/profile'); return; }

    // Already loaded — just redirect to builder
    if (listId === id) {
      const slug = useArmyStore.getState().faction?.slug;
      navigate(slug ? `/builder/${slug}` : '/', { replace: true });
      return;
    }

    setLoading(true);
    loadList(id)
      .then(() => {
        const slug = useArmyStore.getState().faction?.slug;
        navigate(slug ? `/builder/${slug}` : '/', { replace: true });
      })
      .catch(() => navigate('/profile'))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading) return null;

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-dfa-text-muted text-sm animate-pulse">Loading army…</p>
    </div>
  );
}
