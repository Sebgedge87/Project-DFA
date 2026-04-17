import { Check, X } from 'lucide-react';
import type { ArmyEntry } from '@dfa/types';

interface GuidedStepsProps {
  entries: ArmyEntry[];
  isDirty: boolean;
  listId: string | null;
  onDismiss: () => void;
}

interface Step {
  label: string;
  detail: string;
  done: boolean;
}

function buildSteps(entries: ArmyEntry[], isDirty: boolean, listId: string | null): Step[] {
  const hasCaptain = entries.some(e => e.unit_type.role === 'captain');
  const totalModels = entries.reduce((s, e) => s + e.quantity, 0);
  const saved = !isDirty && listId !== null;

  return [
    { label: 'Add Captain', detail: 'Every army needs a Captain', done: hasCaptain },
    { label: '5 Models', detail: 'Fill out at least 5 models', done: totalModels >= 5 },
    { label: 'Save', detail: 'Save your finished list', done: saved },
    { label: 'Done', detail: 'Army ready to share!', done: saved },
  ];
}

export function GuidedSteps({ entries, isDirty, listId, onDismiss }: GuidedStepsProps) {
  const steps = buildSteps(entries, isDirty, listId);
  const activeIdx = steps.findIndex(s => !s.done);

  return (
    <div className="flex items-center gap-2 bg-dfa-surface border border-dfa-border rounded-lg px-3 py-2">
      <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        {steps.map((step, i) => {
          const isDone = step.done;
          const isActive = i === activeIdx;
          return (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-dfa-red/20 text-dfa-red border border-dfa-red/30'
                    : isActive
                    ? 'bg-dfa-red text-white'
                    : 'border border-dfa-border text-dfa-text-muted'
                }`}
              >
                {isDone && <Check size={10} strokeWidth={3} />}
                <span>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="text-dfa-border text-xs">›</span>
              )}
            </div>
          );
        })}
      </div>
      {activeIdx !== -1 && (
        <p className="text-dfa-text-muted text-xs hidden sm:block shrink-0 max-w-[160px] truncate">
          {steps[activeIdx].detail}
        </p>
      )}
      <button onClick={onDismiss} className="text-dfa-text-muted hover:text-dfa-text transition-colors shrink-0 ml-1">
        <X size={13} />
      </button>
    </div>
  );
}
