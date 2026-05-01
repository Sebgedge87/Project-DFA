import { Check, X, CheckCircle2 } from 'lucide-react';
import type { ArmyEntry } from '@dfa/types';

interface ValidationChecklistProps {
  entries: ArmyEntry[];
  points: number;
}

export function ValidationChecklist({ entries, points }: ValidationChecklistProps) {
  if (entries.length === 0) return null;

  const totalModels = entries.reduce((s, e) => s + e.quantity, 0);
  const hasCaptain  = entries.some(e => e.unit_type.role === 'captain');
  const enoughModels = totalModels >= 5;
  const underLimit  = points <= 1000;
  const allValid    = hasCaptain && enoughModels && underLimit;

  if (allValid) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-green-800/60 bg-green-950/40">
        <CheckCircle2 size={14} className="text-green-400 shrink-0" />
        <span className="text-xs text-green-400 font-bold">Valid Army</span>
      </div>
    );
  }

  const checks = [
    { label: 'Captain selected', pass: hasCaptain },
    { label: 'At least 5 models', pass: enoughModels },
    { label: 'Under 1,000pts', pass: underLimit },
  ];

  return (
    <div className="rounded-md border border-dfa-border bg-dfa-surface-raised p-3 space-y-1.5">
      {checks.map(({ label, pass }) => (
        <div key={label} className={`flex items-center gap-2 text-xs ${pass ? 'text-green-400' : 'text-dfa-text-muted'}`}>
          {pass
            ? <Check size={12} className="shrink-0" />
            : <X size={12} className="shrink-0" />
          }
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
