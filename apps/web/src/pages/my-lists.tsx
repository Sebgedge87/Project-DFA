import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import { useMyLists, useDeleteList, useToggleListPublic, supabase } from '@dfa/supabase-client';
import { useAuthStore } from '../stores/authStore';
import { useArmyStore } from '../stores/armyStore';
import { ShareModal } from '../components/ui/ShareModal';

async function exportListAsText(listId: string, listName: string) {
  const { data, error } = await supabase
    .from('army_lists')
    .select(`
      name, points_total,
      faction: factions(name),
      army_entries (
        quantity,
        unit_type: unit_types (
          name, role, points, actions, movement, health,
          melee_attack, ranged_attack, defence, abilities,
          unit_weapons ( weapon: weapons ( name, range_inches, num_attacks, damage ) )
        )
      )
    `)
    .eq('id', listId)
    .single();

  if (error || !data) throw new Error('Export failed');
  const d = data as any;

  const lines: string[] = [
    `${d.name} — ${d.faction?.name ?? 'Unknown Faction'}`,
    `${d.points_total}pts`,
    '='.repeat(40),
    '',
  ];
  for (const e of d.army_entries ?? []) {
    const u = e.unit_type;
    lines.push(`${u.name}${e.quantity > 1 ? ` ×${e.quantity}` : ''}  (${u.points * e.quantity}pts)`);
    lines.push(`  [${u.role.toUpperCase()}]  ACT:${u.actions}  MOV:${u.movement}"  HP:${u.health}  MEL:${u.melee_attack}  RAN:${u.ranged_attack}  DEF:${u.defence}`);
    for (const a of u.abilities ?? []) lines.push(`  • ${a.name}: ${a.description}`);
    const weapons = (u.unit_weapons ?? []).map((uw: any) => uw.weapon).filter(Boolean);
    if (weapons.length) {
      lines.push('  Weapons:');
      for (const w of weapons) lines.push(`    ${w.name}: Rng ${w.range_inches ?? '—'} · Att ${w.num_attacks} · Dmg ${w.damage}`);
    }
    lines.push('');
  }
  lines.push('Death Fields Arena · wargamesatlantic.com');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${listName.replace(/[^a-z0-9]/gi, '_')}_roster.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function MyListsPage() {
  const { user } = useAuthStore();
  const { data: lists, isLoading } = useMyLists(user?.id ?? null);
  const deleteList = useDeleteList();
  const togglePublic = useToggleListPublic();
  const { loadList } = useArmyStore();
  const navigate = useNavigate();

  // Track local public state per list (optimistic update while query refetches)
  const [localPublic, setLocalPublic] = useState<Record<string, boolean>>({});
  // Track which lists are currently exporting
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

  const handleExport = async (id: string, name: string) => {
    setExporting(s => ({ ...s, [id]: true }));
    try {
      await exportListAsText(id, name);
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
                {/* List info */}
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
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(list.id)}
                    aria-label={`Delete ${list.name}`}
                    className="text-dfa-text-muted hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(list.id)}
                    disabled={loadingEdit === list.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors disabled:opacity-50"
                  >
                    {loadingEdit === list.id && <Loader2 size={12} className="animate-spin" />}
                    Edit
                  </button>

                  {/* Share modal — always available, toggle public/private from here */}
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

                  {/* Export as text */}
                  <button
                    onClick={() => handleExport(list.id, list.name)}
                    disabled={exporting[list.id]}
                    aria-label={`Export ${list.name} roster`}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors disabled:opacity-50"
                  >
                    {exporting[list.id] ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
                    Export
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
