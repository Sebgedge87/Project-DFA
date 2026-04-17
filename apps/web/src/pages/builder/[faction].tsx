import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, Minus, Search, X, BookOpen, ShoppingBag, Lightbulb } from 'lucide-react';
import { useUnitTypes, useFactions } from '@dfa/supabase-client';
import { calculatePoints, validateArmy } from '@dfa/logic';
import type { ArmyEntry, UnitRole } from '@dfa/types';

import { UnitCard } from '../../components/unit/UnitCard';
import { PointsBar } from '../../components/builder/PointsBar';
import { ValidationAlert } from '../../components/ui/ValidationAlert';
import { ShareModal } from '../../components/ui/ShareModal';
import { WalkthroughBanner } from '../../components/ui/WalkthroughBanner';
import { useWalkthrough } from '../../hooks/useWalkthrough';
import { useArmyStore } from '../../stores/armyStore';
import { useAuthStore } from '../../stores/authStore';

const ROLES = ['all', 'captain', 'specialist', 'core'] as const;
type RoleFilter = (typeof ROLES)[number];

const ROLE_ORDER: UnitRole[] = ['captain', 'specialist', 'core'];
const ROLE_LABEL: Record<UnitRole, string> = { captain: 'Captains', specialist: 'Specialists', core: 'Core' };

function walkthroughHint(entries: ArmyEntry[], isDirty: boolean, listId: string | null): string {
  const hasCaptain = entries.some(e => e.unit_type.role === 'captain');
  const totalModels = entries.reduce((s, e) => s + e.quantity, 0);
  if (!hasCaptain) return 'Start by adding a Captain — every army requires one. Filter by "Captain" to find them.';
  if (totalModels < 5) return 'Captain added! Fill your roster with Specialists and Core units. You need at least 5 models total.';
  if (isDirty && !listId) return "Looking good! Hit Save Army when you're happy with your list.";
  if (isDirty) return 'You have unsaved changes — hit Save Army to lock them in.';
  return 'Army saved! You can share it or keep building.';
}

export default function BuilderPage() {
  const { faction: factionSlug } = useParams<{ faction: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: factions } = useFactions();
  const faction = factions?.find((f) => f.slug === factionSlug);

  const { data: units, isLoading } = useUnitTypes(faction?.id ?? null);

  const { entries, listName, listId, isDirty, isSaving, addUnit, removeUnit, setQuantity, setName, saveList, setFaction } =
    useArmyStore();
  const [isPublic, setIsPublic] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [activeTab, setActiveTab] = useState<'units' | 'faction'>('units');

  const { dismissed, dismiss, enable } = useWalkthrough();

  // Sync faction into store when resolved from URL
  useEffect(() => {
    if (faction && entries.length === 0 && !useArmyStore.getState().faction) {
      setFaction(faction);
    }
  }, [faction, entries.length, setFaction]);

  const filteredUnits = useMemo(() => {
    if (!units) return [];
    return units.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [units, search, roleFilter]);

  const unitsByRole = useMemo(() => {
    if (!units) return {} as Record<UnitRole, typeof units>;
    return ROLE_ORDER.reduce((acc, role) => {
      acc[role] = units.filter(u => u.role === role);
      return acc;
    }, {} as Record<UnitRole, typeof units>);
  }, [units]);

  const points = calculatePoints(entries);
  const validationErrors = validateArmy(entries).map((r) => r.error!).filter(Boolean);
  const hint = walkthroughHint(entries, isDirty, listId);

  const handleSave = async () => {
    if (!user) { navigate(`/auth?returnTo=${encodeURIComponent(`/builder/${factionSlug}`)}`); return; }
    setSaveError(null);
    try {
      await saveList(isPublic);
      const id = useArmyStore.getState().listId;
      if (id && !shareToken) {
        const { supabase } = await import('@dfa/supabase-client');
        const { data } = await supabase.from('army_lists').select('share_token').eq('id', id).single();
        if (data?.share_token) setShareToken(data.share_token);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setSaveError(e.message ?? 'Save failed');
    }
  };

  if (!faction && factions) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-dfa-text-muted text-sm">Faction not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">

      {/* ── Left panel ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Header */}
        <div className="p-4 md:px-6 md:pt-6 md:pb-0 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-dfa-text-muted hover:text-dfa-text transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide leading-none">
                {faction?.name ?? factionSlug}
              </h1>
              <p className="text-dfa-text-muted text-xs mt-0.5">{faction?.tagline}</p>
            </div>
          </div>

          {/* Guide toggle */}
          <button
            onClick={() => dismissed ? enable() : dismiss()}
            title={dismissed ? 'Enable guided mode' : 'Disable guided mode'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-bold transition-colors ${
              !dismissed
                ? 'bg-dfa-red/10 border-dfa-red/40 text-dfa-red'
                : 'bg-dfa-surface border-dfa-border text-dfa-text-muted hover:text-dfa-text'
            }`}
          >
            <Lightbulb size={13} />
            Guide {dismissed ? 'Off' : 'On'}
          </button>
        </div>

        {/* Guided hint */}
        {!dismissed && (
          <div className="px-4 md:px-6 pt-3 shrink-0">
            <WalkthroughBanner message={hint} onDismiss={dismiss} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 px-4 md:px-6 pt-3 border-b border-dfa-border shrink-0">
          {(['units', 'faction'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-dfa-red text-dfa-text'
                  : 'border-transparent text-dfa-text-muted hover:text-dfa-text'
              }`}
            >
              {tab === 'units' ? 'Units' : 'Faction Info'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {activeTab === 'units' && (
            <>
              {/* Search + role filter */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dfa-text-muted pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search units…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-dfa-surface border border-dfa-border rounded pl-8 pr-8 py-1.5 text-sm text-dfa-text placeholder-dfa-text-muted focus:outline-none focus:border-dfa-red"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-dfa-text-muted hover:text-dfa-text">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="flex gap-1">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1.5 rounded text-xs font-bold capitalize transition-colors ${
                        roleFilter === r
                          ? 'bg-dfa-red text-white'
                          : 'bg-dfa-surface border border-dfa-border text-dfa-text-muted hover:text-dfa-text'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">Loading units…</div>
              ) : filteredUnits.length === 0 ? (
                <p className="text-dfa-text-muted text-sm text-center py-10">No units match your search.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredUnits.map(unit => {
                    const entry = entries.find(e => e.unit_type.id === unit.id);
                    return <UnitCard key={unit.id} unit={unit} onAdd={addUnit} quantity={entry?.quantity ?? 0} />;
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'faction' && faction && (
            <div className="space-y-6 max-w-2xl">

              {/* Hero */}
              <div
                className="rounded-lg p-5"
                style={{ background: `linear-gradient(135deg, #${faction.color_primary}33 0%, transparent 100%)` }}
              >
                <p className="text-xs text-dfa-text-muted uppercase tracking-widest mb-1">{faction.tagline}</p>
                <h2 className="font-display text-dfa-text text-2xl font-bold uppercase">{faction.name}</h2>
                {faction.lore && (
                  <p className="text-dfa-text-muted text-sm leading-relaxed mt-3">{faction.lore}</p>
                )}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2">
                {faction.rulebook_url && (
                  <a href={faction.rulebook_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-dfa-border rounded text-xs text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted transition-colors">
                    <BookOpen size={13} /> View Rulebook
                  </a>
                )}
                {faction.store_url && (
                  <a href={faction.store_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-dfa-border rounded text-xs text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted transition-colors">
                    <ShoppingBag size={13} /> Buy Miniatures
                  </a>
                )}
              </div>

              {/* Roster */}
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-dfa-text-muted font-medium">Full Roster</h3>
                {isLoading ? (
                  <p className="text-dfa-text-muted text-xs animate-pulse">Loading…</p>
                ) : (
                  ROLE_ORDER.map(role => {
                    const roleUnits = unitsByRole[role];
                    if (!roleUnits?.length) return null;
                    return (
                      <div key={role}>
                        <p className="text-xs font-bold uppercase tracking-wider text-dfa-text mb-2">{ROLE_LABEL[role]}</p>
                        {/* Column headers */}
                        <div className="flex items-center justify-between px-3 pb-1 text-[10px] uppercase tracking-widest text-dfa-text-muted font-medium">
                          <span>Unit</span>
                          <div className="flex items-center gap-4 hidden sm:flex">
                            <span className="w-6 text-center">Act</span>
                            <span className="w-6 text-center">Mov</span>
                            <span className="w-6 text-center">HP</span>
                            <span className="w-10 text-right">Pts</span>
                          </div>
                          <span className="sm:hidden w-10 text-right">Pts</span>
                        </div>
                        <div className="space-y-1">
                          {roleUnits.map(u => (
                            <div key={u.id} className="flex items-center justify-between px-3 py-2 bg-dfa-surface rounded text-sm">
                              <span className="text-dfa-text">{u.name}</span>
                              <div className="flex items-center gap-4 text-xs font-mono">
                                <span className="text-dfa-text-muted hidden sm:flex items-center gap-4">
                                  <span className="w-6 text-center">{u.actions}</span>
                                  <span className="w-6 text-center">{u.movement}"</span>
                                  <span className="w-6 text-center">{u.health}</span>
                                </span>
                                <span className="text-dfa-gold font-bold w-10 text-right">{u.points}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Army sidebar ────────────────────────────────────────────────── */}
      <aside className="lg:w-80 xl:w-96 bg-dfa-surface border-t lg:border-t-0 lg:border-l border-dfa-border lg:overflow-y-auto">
        <div className="sticky top-0 z-10 bg-dfa-surface p-4 border-b border-dfa-border space-y-3">
          <input
            type="text"
            value={listName}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-1.5 text-sm text-dfa-text focus:outline-none focus:border-dfa-red"
          />
          <PointsBar current={points} />
          {validationErrors.length > 0 && <ValidationAlert errors={validationErrors} />}
        </div>

        <div>
          <div className="divide-y divide-dfa-border">
            {entries.length === 0 ? (
              <p className="text-dfa-text-muted text-sm text-center py-10 px-4">
                Add units from the list to build your army.
              </p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dfa-text font-medium truncate">{entry.unit_type.name}</p>
                    <p className="text-xs text-dfa-gold font-mono">
                      {entry.unit_type.points * entry.quantity}pts
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setQuantity(entry.id, entry.quantity - 1)}
                      className="w-7 h-7 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm text-dfa-text font-mono">{entry.quantity}</span>
                    <button onClick={() => addUnit(entry.unit_type)}
                      className="w-7 h-7 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeUnit(entry.id)}
                    className="text-dfa-text-muted hover:text-red-400 transition-colors ml-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 space-y-2">
            {saveError && <p className="text-xs text-red-400">{saveError}</p>}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-dfa-red hover:bg-dfa-red-bright disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors"
            >
              <Save size={15} />
              {isSaving ? 'Saving…' : saved ? 'Saved!' : 'Save Army'}
            </button>
            {listId && shareToken && (
              <ShareModal
                listId={listId}
                shareToken={shareToken}
                isPublic={isPublic}
                onTogglePublic={async (pub) => { await saveList(pub); setIsPublic(pub); }}
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
