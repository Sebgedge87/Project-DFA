import type { UnitType } from '@dfa/types';

type StatBlockProps = Pick<
  UnitType,
  'actions' | 'movement' | 'melee_attack' | 'ranged_attack' | 'defence' | 'health'
>;

const STATS = [
  { label: 'ACT', key: 'actions' },
  { label: 'MOV', key: 'movement' },
  { label: 'MEL', key: 'melee_attack' },
  { label: 'RAN', key: 'ranged_attack' },
  { label: 'DEF', key: 'defence' },
  { label: 'HP',  key: 'health' },
] as const;

export function StatBlock(stats: StatBlockProps) {
  return (
    <div className="grid grid-cols-6 gap-1 text-center">
      {STATS.map(({ label, key }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-[9px] text-dfa-text-muted font-body uppercase tracking-wide leading-none mb-0.5">
            {label}
          </span>
          <span className="font-mono text-dfa-text font-bold text-sm leading-none">
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
