import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileText, Loader2, Eye } from 'lucide-react';
import { useMyLists, useDeleteList, useToggleListPublic, supabase } from '@dfa/supabase-client';
import { useAuthStore } from '../stores/authStore';
import { useArmyStore } from '../stores/armyStore';
import { ShareModal } from '../components/ui/ShareModal';
import { exportRosterPdf } from '../utils/exportRosterPdf';

async function fetchAndExportPdf(listId: string) {
  const { data, error } = await supabase
    .from('army_lists')
    .select(`
      name, points_total,
      faction: factions(name, color_primary),
      army_entries (
        quantity,
        unit_type: unit_types (
          name, role, points, actions, movement, health,
          melee_attack, ranged_attack, defence, abilities,
          unit_weapons ( weapon: weapons (
            name, range_inches, num_attacks, damage, defence_mod,
            weapon_keywords ( keyword: keywords (name), parameter )
          ))
        )
      )
    `)
    .eq('id', listId)
    .single();

  if (error || !data) throw new Error('Export failed');
  const d = data as any;

  exportRosterPdf({
    name: d.name,
    points_total: d.points_total,
    faction: d.faction,
    army_entries: (d.army_entries ?? []).map((e: any) => ({
      quantity: e.quantity,
      unit_type: {
        ...e.unit_type,
        weapons: (e.unit_type?.unit_weapons ?? []).map((uw: any) => uw.weapon).filter(Boolean),
      },
    })),
  });
}

export default function MyListsPage() {
  const { user } = useAuthStore();
  const { data: lists, isLoading } = useMyLists(user?.id ?? null);
  const deleteList = useDeleteList();
  const togglePublic = useToggleListPublic();
  const { loadList } = useArmyStore();
  const navigate = useNavigate();

  const [localPublic, setLocalPublic] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState<Record<string, boolean>>({});
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);

  const handleEdit = async (id: string) => {
    setLoadingEdit(id);
    try {
      await loadList(id);
      const slug = useArmyStore.getState().faction?.slug;
      navigate(slug ? `/builder/${slug}` : '/');
    } catch {
      navigate('/');
    } finally {
      setLoadingEdit(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this army list? This cannot be undone.')) {
      deleteList.mutate(id);
    }
  };

  const handleExport = async (id: string) => {
    setExporting(s => ({ ...s, [id]: true }));
    try {
      await fetchAndExportPdf(id);
    } catch {
      alert('Export failed — please try again.');
    } finally {
      setExporting(s => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">My Armies</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
        >
          <Plus size={15} />
          New Army
        </button>
      </div>

      {isLoading ? (
        <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">Loading your armies…</div>
      ) : !lists?.length ? (
        <div className="text-center py-12 space-y-3 bg-dfa-surface border border-dfa-border rounded-lg">
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
          {lists.map((list) => {
            const isPublic = localPublic[list.id] ?? list.is_public;
            return (
              <div key={list.id} className="bg-dfa-surface border border-dfa-border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-dfa-text font-medium truncate">{list.name}</p>
                    <p className="text-xs text-dfa-text-muted mt-0.5">
                      <span className="text-dfa-gold font-mono font-bold">{list.points_total}pts</span>
                      {' · '}
                      <span className={isPublic ? 'text-green-400' : 'text-dfa-text-muted'}>
                        {isPublic ? 'Public' : 'Private'}
                      </span>
                      {' · '}{new Date(list.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(list.id)}
                    aria-label={`Delete ${list.name}`}
                    className="text-dfa-text-muted hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(list.id)}
                    disabled={loadingEdit === list.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors disabled:opacity-50"
                  >
                    {loadingEdit === list.id && <Loader2 size={12} className="animate-spin" />}
                    Edit
                  </button>

                  {list.share_token && (
                    <a
                      href={`/share/${list.share_token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </a>
                  )}

                  <ShareModal
                    listId={list.id}
                    shareToken={list.share_token}
                    isPublic={isPublic}
                    onTogglePublic={async (pub) => {
                      setLocalPublic(s => ({ ...s, [list.id]: pub }));
                      await togglePublic.mutateAsync({ id: list.id, isPublic: pub });
                    }}
                    triggerClassName="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
                  />

                  <button
                    onClick={() => handleExport(list.id)}
                    disabled={exporting[list.id]}
                    aria-label={`Export ${list.name} roster`}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors disabled:opacity-50"
                  >
                    {exporting[list.id] ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
                    Export PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
