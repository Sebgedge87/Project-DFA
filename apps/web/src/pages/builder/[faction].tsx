import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, Minus, Search, X, BookOpen, ShoppingBag, Lightbulb, Scroll, HelpCircle, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useUnitTypes, useFactions } from '@dfa/supabase-client';
import { calculatePoints } from '@dfa/logic';
import type { UnitRole, UnitType } from '@dfa/types';

import { UnitCard } from '../../components/unit/UnitCard';
import { PointsBar } from '../../components/builder/PointsBar';
import { ValidationChecklist } from '../../components/builder/ValidationChecklist';
import { ShareModal } from '../../components/ui/ShareModal';
import { GuidedSteps } from '../../components/ui/GuidedSteps';
import { RosterPanel } from '../../components/ui/RosterPanel';
import { useWalkthrough } from '../../hooks/useWalkthrough';
import { useWalkthroughStore } from '../../stores/walkthroughStore';
import { useArmyStore } from '../../stores/armyStore';
import { useAuthStore } from '../../stores/authStore';

const ROLES = ['all', 'captain', 'specialist', 'core'] as const;
type RoleFilter = (typeof ROLES)[number];
type SortOption  = 'role' | 'pts-asc' | 'pts-desc' | 'name-asc' | 'name-desc';

const ROLE_ORDER: UnitRole[] = ['captain', 'specialist', 'core'];
const ROLE_LABEL: Record<UnitRole, string> = { captain: 'Captains', specialist: 'Specialists', core: 'Core' };
const ROLE_IDX:   Record<UnitRole, number> = { captain: 0, specialist: 1, core: 2 };


export default function BuilderPage() {
  const { faction: factionSlug } = useParams<{ faction: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: factions } = useFactions();
  const faction = factions?.find((f) => f.slug === factionSlug);

  const { data: units, isLoading } = useUnitTypes(faction?.id ?? null);

  const { entries, listName, listId, isDirty, isSaving, shareToken, addUnit, removeUnit, setQuantity, setName, saveList, setFaction, _hasHydrated } =
    useArmyStore();
  const [isPublic, setIsPublic] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('role');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPoints, setMinPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [rosterFeedback, setRosterFeedback] = useState<Record<string, 'added' | 'error'>>({});
  const [activeTab, setActiveTab] = useState<'units' | 'faction'>('units');
  const [rosterOpen, setRosterOpen] = useState(false);
  const rosterTriggerRef = useRef<HTMLButtonElement>(null);

  const { dismissed, dismiss, enable } = useWalkthrough(user?.id ?? null);
  const openWalkthrough = useWalkthroughStore(s => s.open);

  // Sync faction into store when it resolves from URL, or when navigating to a different faction
  useEffect(() => {
    if (faction && useArmyStore.getState().faction?.id !== faction.id) {
      setFaction(faction);
    }
  }, [faction?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredUnits = useMemo(() => {
    if (!units) return [];
    return units
      .filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
        const matchesRole   = roleFilter === 'all' || u.role === roleFilter;
        const matchesMin    = u.points >= minPoints;
        const matchesMax    = maxPoints === 0 || u.points <= maxPoints;
        return matchesSearch && matchesRole && matchesMin && matchesMax;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'pts-asc':  return a.points - b.points;
          case 'pts-desc': return b.points - a.points;
          case 'name-asc': return a.name.localeCompare(b.name);
          case 'name-desc':return b.name.localeCompare(a.name);
          default:         return (ROLE_IDX[a.role] - ROLE_IDX[b.role]) || a.points - b.points;
        }
      });
  }, [units, search, roleFilter, sortBy, minPoints, maxPoints]);

  const unitsByRole = useMemo(() => {
    if (!units) return {} as Record<UnitRole, typeof units>;
    return ROLE_ORDER.reduce((acc, role) => {
      acc[role] = units.filter(u => u.role === role);
      return acc;
    }, {} as Record<UnitRole, typeof units>);
  }, [units]);

  const points = calculatePoints(entries);

  const handleQuickAdd = (unit: UnitType) => {
    const result = addUnit(unit);
    const status = result.ok ? 'added' : 'error';
    setRosterFeedback(prev => ({ ...prev, [unit.id]: status }));
    setTimeout(() => setRosterFeedback(prev => { const n = { ...prev }; delete n[unit.id]; return n; }), 1500);
  };

  const handleSave = async () => {
    if (!user) { navigate(`/auth?returnTo=${encodeURIComponent(`/builder/${factionSlug}`)}`); return; }
    setSaveError(null);
    try {
      await saveList(isPublic);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setSaveError(e.message ?? 'Save failed');
    }
  };

  if (!_hasHydrated) return null;

  if (!faction && factions) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-dfa-text-muted text-sm">Faction not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen">

      {/* ── Left panel ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">

        {/* Header */}
        <div
          className="p-4 md:px-6 md:pt-6 md:pb-0 flex items-center justify-between gap-3 shrink-0"
          style={faction?.color_primary ? { background: `linear-gradient(135deg, #${faction.color_primary}18 0%, transparent 60%)` } : undefined}
        >
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

          <div className="flex items-center gap-2">
            {/* Guide progress bar toggle */}
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

            {/* New player guide — opens walkthrough modal */}
            <button
              onClick={openWalkthrough}
              title="New player guide"
              aria-label="Open new player guide"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-dfa-border bg-dfa-surface text-dfa-text-muted hover:text-dfa-text text-xs font-bold transition-colors"
            >
              <HelpCircle size={13} />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>
        </div>

        {/* Guided hint bar */}
        {!dismissed && (
          <div className="px-4 md:px-6 pt-3 shrink-0">
            <GuidedSteps entries={entries} isDirty={isDirty} listId={listId} onDismiss={dismiss} />
          </div>
        )}

        {/* Mobile army summary bar */}
        {(() => {
          const totalModels = entries.reduce((s, e) => s + e.quantity, 0);
          const pct = points / 1000;
          const over = points > 1000;
          const ptColour = over || pct >= 0.95 ? 'text-red-400' : pct >= 0.8 ? 'text-amber-400' : 'text-dfa-gold';
          return (
            <div className="md:hidden sticky top-0 z-30 bg-dfa-surface border-b border-dfa-border px-4 py-2 flex items-center gap-3 shrink-0">
              <span className={`font-mono font-bold text-sm ${ptColour}`}>{points}<span className="text-dfa-text-muted font-normal text-xs"> / 1000pts</span></span>
              <span className="text-dfa-text-muted text-xs">{totalModels} model{totalModels !== 1 ? 's' : ''}</span>
              <a
                href="#army-sidebar"
                onClick={e => { e.preventDefault(); document.getElementById('army-sidebar')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="ml-auto px-3 py-1 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors"
              >
                View Army
              </a>
            </div>
          );
        })()}

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
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <label htmlFor="unit-search" className="sr-only">Search units</label>
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dfa-text-muted pointer-events-none" aria-hidden="true" />
                    <input
                      id="unit-search"
                      type="text"
                      placeholder="Search units…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-dfa-surface border border-dfa-border rounded pl-8 pr-8 py-1.5 text-sm text-dfa-text placeholder-dfa-text-muted focus:outline-none focus:border-dfa-red"
                    />
                    {search && (
                      <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-dfa-text-muted hover:text-dfa-text">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {ROLES.map(r => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        aria-pressed={roleFilter === r}
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

                {/* Sort + advanced filter toggle */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={12} className="text-dfa-text-muted shrink-0" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort units"
                    className="bg-dfa-surface border border-dfa-border rounded px-2 py-1 text-xs text-dfa-text focus:outline-none focus:border-dfa-red"
                  >
                    <option value="role">Role</option>
                    <option value="pts-asc">Points ↑</option>
                    <option value="pts-desc">Points ↓</option>
                    <option value="name-asc">Name A→Z</option>
                    <option value="name-desc">Name Z→A</option>
                  </select>
                  <button
                    onClick={() => setShowAdvanced(v => !v)}
                    className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-bold transition-colors ${
                      showAdvanced || minPoints > 0 || maxPoints > 0
                        ? 'bg-dfa-red/10 border-dfa-red/40 text-dfa-red'
                        : 'bg-dfa-surface border-dfa-border text-dfa-text-muted hover:text-dfa-text'
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    Filters{minPoints > 0 || maxPoints > 0 ? ' ●' : ''}
                  </button>
                </div>

                {/* Advanced filter panel */}
                {showAdvanced && (
                  <div className="p-3 bg-dfa-surface-raised border border-dfa-border rounded space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-dfa-text-muted font-medium">Points range</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={minPoints || ''}
                        onChange={e => setMinPoints(Number(e.target.value) || 0)}
                        placeholder="Min"
                        aria-label="Minimum points"
                        className="w-20 bg-dfa-black border border-dfa-border rounded px-2 py-1 text-xs text-dfa-text focus:outline-none focus:border-dfa-red"
                      />
                      <span className="text-dfa-text-muted text-xs">—</span>
                      <input
                        type="number"
                        min={0}
                        value={maxPoints || ''}
                        onChange={e => setMaxPoints(Number(e.target.value) || 0)}
                        placeholder="Max"
                        aria-label="Maximum points"
                        className="w-20 bg-dfa-black border border-dfa-border rounded px-2 py-1 text-xs text-dfa-text focus:outline-none focus:border-dfa-red"
                      />
                      {(minPoints > 0 || maxPoints > 0) && (
                        <button
                          onClick={() => { setMinPoints(0); setMaxPoints(0); }}
                          className="text-xs text-dfa-text-muted hover:text-dfa-text ml-auto"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">Loading units…</div>
              ) : filteredUnits.length === 0 ? (
                <p className="text-dfa-text-muted text-sm text-center py-10">No units match your search.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredUnits.map(unit => {
                    const entry = entries.find(e => e.unit_type.id === unit.id);
                    return (
                      <UnitCard
                        key={unit.id}
                        unit={unit}
                        onAdd={addUnit}
                        quantity={entry?.quantity ?? 0}
                        currentPoints={points}
                      />
                    );
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
                <Link
                  to="/rules"
                  className="flex items-center gap-2 px-3 py-2 border border-dfa-border rounded text-xs text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted transition-colors"
                >
                  <BookOpen size={13} /> View Rules
                </Link>
                <button
                  ref={rosterTriggerRef}
                  onClick={() => setRosterOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-dfa-border rounded text-xs text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted transition-colors"
                >
                  <Scroll size={13} /> Roster Reference
                </button>
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
                            <span className="w-6" />
                          </div>
                          <span className="sm:hidden w-10 text-right">Pts</span>
                        </div>
                        <div className="space-y-1">
                          {roleUnits.map(u => {
                            const fb = rosterFeedback[u.id];
                            return (
                              <div key={u.id} className="flex items-center justify-between px-3 py-2 bg-dfa-surface rounded text-sm">
                                <span className="text-dfa-text">{u.name}</span>
                                <div className="flex items-center gap-4 text-xs font-mono">
                                  <span className="text-dfa-text-muted hidden sm:flex items-center gap-4">
                                    <span className="w-6 text-center">{u.actions}</span>
                                    <span className="w-6 text-center">{u.movement}"</span>
                                    <span className="w-6 text-center">{u.health}</span>
                                  </span>
                                  <span className="text-dfa-gold font-bold w-10 text-right">{u.points}</span>
                                  <button
                                    onClick={() => handleQuickAdd(u)}
                                    aria-label={`Quick add ${u.name} to army`}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                                      fb === 'added' ? 'border-green-700 bg-green-900/40 text-green-400'
                                      : fb === 'error' ? 'border-red-800 bg-red-900/40 text-red-400'
                                      : 'border-dfa-border text-dfa-text-muted hover:bg-dfa-red hover:border-dfa-red hover:text-white'
                                    }`}
                                  >
                                    <Plus size={11} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
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
      <aside id="army-sidebar" className="lg:w-80 xl:w-96 flex flex-col bg-dfa-surface border-t lg:border-t-0 lg:border-l border-dfa-border lg:sticky lg:top-0 lg:h-screen">
        {/* Fixed header */}
        <div className="shrink-0 bg-dfa-surface p-4 border-b border-dfa-border space-y-3">
          <input
            type="text"
            value={listName}
            onChange={(e) => setName(e.target.value)}
            aria-label="Army name"
            placeholder="Army name…"
            className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-1.5 text-sm text-dfa-text focus:outline-none focus:border-dfa-red"
          />
          <PointsBar current={points} factionColor={faction?.color_primary} />
          <ValidationChecklist entries={entries} points={points} />
        </div>

        {/* Scrollable entries */}
        <div className="flex-1 overflow-y-auto divide-y divide-dfa-border">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center text-center px-6 py-8 space-y-4">
              <span className="text-5xl opacity-20">⚔</span>
              <div>
                <p className="text-dfa-text text-sm font-bold">Your army is empty</p>
                <p className="text-dfa-text-muted text-xs mt-0.5">Add units from the list to get started</p>
              </div>
              <div className="w-full text-left space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-dfa-text-muted font-medium mb-2">Composition guide</p>
                {[
                  '1 Captain (required)',
                  'Up to 4 Specialist slots',
                  'Fill remaining points with Core units',
                ].map(tip => (
                  <div key={tip} className="flex items-start gap-2 text-xs text-dfa-text-muted">
                    <span className="text-dfa-gold mt-0.5 shrink-0">›</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
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
                    aria-label={`Remove one ${entry.unit_type.name}`}
                    className="w-11 h-11 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm text-dfa-text font-mono" aria-label={`${entry.quantity} ${entry.unit_type.name}`}>{entry.quantity}</span>
                  <button onClick={() => addUnit(entry.unit_type)}
                    aria-label={`Add one ${entry.unit_type.name}`}
                    className="w-11 h-11 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeUnit(entry.id)}
                  aria-label={`Remove ${entry.unit_type.name} from army`}
                  className="text-dfa-text-muted hover:text-red-400 transition-colors ml-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Save section — always visible at bottom */}
        <div className="shrink-0 p-4 space-y-2 border-t border-dfa-border">
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
      </aside>

      <RosterPanel open={rosterOpen} onClose={() => setRosterOpen(false)} triggerRef={rosterTriggerRef} />
    </div>
  );
}
