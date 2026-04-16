import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useUnitTypes, useFactions } from '@dfa/supabase-client';
import { calculatePoints, validateArmy } from '@dfa/logic';

import { UnitCard } from '../../components/unit/UnitCard';
import { PointsBar } from '../../components/builder/PointsBar';
import { ValidationAlert } from '../../components/ui/ValidationAlert';
import { useArmyStore } from '../../stores/armyStore';
import { useAuthStore } from '../../stores/authStore';

export default function BuilderPage() {
  const { faction: factionSlug } = useParams<{ faction: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: factions } = useFactions();
  const faction = factions?.find((f) => f.slug === factionSlug);

  const { data: units, isLoading } = useUnitTypes(faction?.id ?? null);

  const { entries, listName, isDirty, isSaving, addUnit, removeUnit, setQuantity, setName, saveList, setFaction } =
    useArmyStore();

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync faction into store when resolved from URL
  if (faction && entries.length === 0 && !useArmyStore.getState().faction) {
    setFaction(faction);
  }

  const points = calculatePoints(entries);
  const validationErrors = validateArmy(entries).map((r) => r.error!).filter(Boolean);

  const handleSave = async () => {
    if (!user) { navigate('/auth'); return; }
    setSaveError(null);
    try {
      await saveList();
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
      {/* Unit picker */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-dfa-text-muted hover:text-dfa-text transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">
              {faction?.name ?? factionSlug}
            </h1>
            <p className="text-dfa-text-muted text-xs">{faction?.tagline}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">
            Loading units…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {units?.map((unit) => {
              const entry = entries.find((e) => e.unit_type.id === unit.id);
              return (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  onAdd={addUnit}
                  quantity={entry?.quantity ?? 0}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Army sidebar */}
      <aside className="lg:w-80 xl:w-96 bg-dfa-surface border-t lg:border-t-0 lg:border-l border-dfa-border flex flex-col">
        <div className="p-4 border-b border-dfa-border space-y-3">
          <input
            type="text"
            value={listName}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-1.5 text-sm text-dfa-text focus:outline-none focus:border-dfa-red"
          />
          <PointsBar current={points} />
          {validationErrors.length > 0 && (
            <ValidationAlert errors={validationErrors} />
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-dfa-border">
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
                  <button
                    onClick={() => setQuantity(entry.id, entry.quantity - 1)}
                    className="w-7 h-7 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center text-sm text-dfa-text font-mono">
                    {entry.quantity}
                  </span>
                  <button
                    onClick={() => addUnit(entry.unit_type)}
                    className="w-7 h-7 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeUnit(entry.id)}
                  className="text-dfa-text-muted hover:text-red-400 transition-colors ml-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-dfa-border space-y-2">
          {saveError && <p className="text-xs text-red-400">{saveError}</p>}
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-dfa-red hover:bg-dfa-red-bright disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors"
          >
            <Save size={15} />
            {isSaving ? 'Saving…' : saved ? 'Saved!' : 'Save Army'}
          </button>
        </div>
      </aside>
    </div>
  );
}
