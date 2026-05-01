import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { UnitType } from '@dfa/types';

interface ComparePanelProps {
  units:    UnitType[];
  onRemove: (id: string) => void;
  onClear:  () => void;
}

interface StatDef { key: keyof UnitType; label: string; higherBetter: boolean }

const STATS: StatDef[] = [
  { key: 'points',        label: 'Pts', higherBetter: false },
  { key: 'actions',       label: 'Act', higherBetter: true  },
  { key: 'movement',      label: 'Mov', higherBetter: true  },
  { key: 'melee_attack',  label: 'Mel', higherBetter: true  },
  { key: 'ranged_attack', label: 'Rng', higherBetter: true  },
  { key: 'defence',       label: 'Def', higherBetter: false },
  { key: 'health',        label: 'HP',  higherBetter: true  },
];

function cellColour(val: number, vals: number[], higherBetter: boolean): string {
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  if (max === min) return 'text-dfa-text';
  const best = higherBetter ? max : min;
  const worst = higherBetter ? min : max;
  if (val === best)  return 'text-green-400 font-bold';
  if (val === worst) return 'text-red-400';
  return 'text-dfa-text';
}

export function ComparePanel({ units, onRemove, onClear }: ComparePanelProps) {
  return (
    <AnimatePresence>
      {units.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="mt-4 rounded-lg border border-dfa-border bg-dfa-surface-raised overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-dfa-border">
            <p className="text-xs font-bold text-dfa-text uppercase tracking-wide">
              Comparing {units.length} unit{units.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3">
              {units.length < 3 && (
                <span className="text-[10px] text-dfa-text-muted">
                  Select up to {3 - units.length} more
                </span>
              )}
              <button onClick={onClear} className="text-xs text-dfa-text-muted hover:text-dfa-text transition-colors">
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dfa-border">
                  <th className="px-3 py-2 text-left text-dfa-text-muted font-medium w-10">Stat</th>
                  {units.map(u => (
                    <th key={u.id} className="px-3 py-2 text-center min-w-[90px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-dfa-text font-bold leading-tight">{u.name}</span>
                        <span className="text-dfa-text-muted text-[10px] capitalize">{u.role}</span>
                        <button
                          onClick={() => onRemove(u.id)}
                          aria-label={`Remove ${u.name} from comparison`}
                          className="text-dfa-text-muted hover:text-red-400 mt-0.5 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATS.map(({ key, label, higherBetter }) => {
                  const vals = units.map(u => u[key] as number);
                  return (
                    <tr key={key} className="border-b border-dfa-border last:border-0">
                      <td className="px-3 py-1.5 text-dfa-text-muted">{label}</td>
                      {units.map(u => {
                        const val = u[key] as number;
                        return (
                          <td key={u.id} className={`px-3 py-1.5 text-center font-mono ${cellColour(val, vals, higherBetter)}`}>
                            {key === 'movement' ? `${val}"` : val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
