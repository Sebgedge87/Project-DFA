import { Sparkles } from 'lucide-react';
import type { ArmyEntry, UnitType } from '@dfa/types';

interface UnitSuggestionsProps {
  entries:  ArmyEntry[];
  points:   number;
  allUnits: UnitType[];
  onAdd:    (unit: UnitType) => void;
}

interface Suggestion { unit: UnitType; reason: string }

function getSuggestions(entries: ArmyEntry[], points: number, allUnits: UnitType[]): Suggestion[] {
  const remaining  = 1000 - points;
  const hasCaptain = entries.some(e => e.unit_type.role === 'captain');
  const hasRanged  = entries.some(e => e.unit_type.ranged_attack > 0);
  const addedIds   = new Set(entries.map(e => e.unit_type.id));
  const affordable = allUnits.filter(u => u.points <= remaining && !addedIds.has(u.id));

  const out: Suggestion[] = [];

  if (!hasCaptain) {
    const c = affordable.find(u => u.role === 'captain');
    if (c) out.push({ unit: c, reason: 'Captain required' });
  }

  if (!hasRanged && out.length < 3) {
    const r = affordable.find(u => u.ranged_attack > 0 && u.role !== 'captain');
    if (r) out.push({ unit: r, reason: 'Add ranged support' });
  }

  if (remaining > 0 && remaining <= 150 && out.length < 3) {
    const fits = affordable
      .filter(u => !out.some(s => s.unit.id === u.id))
      .sort((a, b) => b.points - a.points)[0];
    if (fits) out.push({ unit: fits, reason: `Fits ${remaining}pts budget` });
  }

  return out.slice(0, 3);
}

export function UnitSuggestions({ entries, points, allUnits, onAdd }: UnitSuggestionsProps) {
  if (entries.length === 0 || allUnits.length === 0) return null;

  const suggestions = getSuggestions(entries, points, allUnits);
  if (suggestions.length === 0) return null;

  return (
    <div className="border-t border-dfa-border">
      <div className="px-3 py-2 flex items-center gap-2">
        <Sparkles size={12} className="text-dfa-gold shrink-0" />
        <p className="text-[10px] uppercase tracking-widest text-dfa-text-muted font-medium">Suggestions</p>
      </div>
      <div className="space-y-1 px-3 pb-3">
        {suggestions.map(({ unit, reason }) => (
          <div key={unit.id} className="flex items-center gap-2 bg-dfa-surface-raised rounded px-2 py-1.5">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-dfa-text font-medium truncate">{unit.name}</p>
              <p className="text-[10px] text-dfa-text-muted">{reason} · {unit.points}pts</p>
            </div>
            <button
              onClick={() => onAdd(unit)}
              className="text-[10px] font-bold text-dfa-gold hover:text-dfa-text px-2 py-1 border border-dfa-gold/30 hover:border-dfa-gold/60 rounded transition-colors shrink-0"
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
