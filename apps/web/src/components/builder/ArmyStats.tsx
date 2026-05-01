import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ArmyEntry, UnitRole } from '@dfa/types';

interface ArmyStatsProps {
  entries: ArmyEntry[];
  points:  number;
}

const ROLE_COLOURS: Record<UnitRole, string> = {
  captain:    'bg-dfa-gold',
  specialist: 'bg-dfa-red',
  core:       'bg-dfa-border-neutral',
};

const ROLE_LABELS: Record<UnitRole, string> = {
  captain: 'Captain', specialist: 'Specialist', core: 'Core',
};

const ROLES: UnitRole[] = ['captain', 'specialist', 'core'];

export function ArmyStats({ entries, points }: ArmyStatsProps) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  const totalModels = entries.reduce((s, e) => s + e.quantity, 0);
  const totalHP     = entries.reduce((s, e) => s + e.unit_type.health * e.quantity, 0);
  const avgMov      = totalModels > 0
    ? (entries.reduce((s, e) => s + e.unit_type.movement * e.quantity, 0) / totalModels).toFixed(1)
    : '—';
  const rangedCount = entries
    .filter(e => e.unit_type.ranged_attack > 0)
    .reduce((s, e) => s + e.quantity, 0);

  const rolePoints: Partial<Record<UnitRole, number>> = {};
  for (const e of entries) {
    rolePoints[e.unit_type.role] = (rolePoints[e.unit_type.role] ?? 0) + e.unit_type.points * e.quantity;
  }

  return (
    <div className="border border-dfa-border rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-dfa-text-muted hover:text-dfa-text transition-colors"
        aria-expanded={open}
      >
        <span>Army Stats</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3 border-t border-dfa-border">

          {/* Points by role */}
          <div className="space-y-2 pt-2">
            <p className="text-[10px] uppercase tracking-widest text-dfa-text-muted font-medium">Points by role</p>
            {ROLES.map(role => {
              const rpts = rolePoints[role] ?? 0;
              if (rpts === 0) return null;
              const pct = points > 0 ? (rpts / points) * 100 : 0;
              return (
                <div key={role} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-dfa-text-muted">{ROLE_LABELS[role]}</span>
                    <span className="font-mono text-dfa-text-muted">
                      {rpts}pts <span className="opacity-60">({Math.round(pct)}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-dfa-surface-raised rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ROLE_COLOURS[role]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Capability summary */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Models',   value: totalModels },
              { label: 'Total HP', value: totalHP },
              { label: 'Avg Mov',  value: `${avgMov}"` },
              { label: 'Ranged',   value: `${rangedCount} / ${totalModels}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-dfa-surface-raised rounded px-2 py-1.5">
                <p className="text-[10px] text-dfa-text-muted">{label}</p>
                <p className="text-sm font-mono font-bold text-dfa-text">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
