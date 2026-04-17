import type { Ability } from '@dfa/types';
import { Tooltip } from '../ui/Tooltip';

interface AbilityListProps {
  abilities: Ability[];
}

export function AbilityList({ abilities }: AbilityListProps) {
  if (abilities.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-dfa-text uppercase tracking-widest">
        Abilities
      </p>
      {abilities.map((ability, i) => (
        <div key={i} className="text-xs leading-snug">
          <Tooltip title={ability.name} description={ability.description}>
            <span className="font-bold text-dfa-gold">{ability.name}</span>
          </Tooltip>
          <span className="text-dfa-text-muted">: {ability.description}</span>
        </div>
      ))}
    </div>
  );
}
