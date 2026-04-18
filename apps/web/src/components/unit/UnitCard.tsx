import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { UnitType, ValidationResult } from '@dfa/types';
import { StatBlock } from './StatBlock';
import { AbilityList } from './AbilityList';
import { WeaponTable } from './WeaponTable';
import { RoleBadge } from './RoleBadge';

interface UnitCardProps {
  unit:       UnitType;
  onAdd:      (unit: UnitType) => ValidationResult;
  quantity?:  number;
  onSelect?:  (unit: UnitType) => void;
}

export function UnitCard({ unit, onAdd, quantity = 0, onSelect }: UnitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleAdd = () => {
    const result = onAdd(unit);
    if (!result.ok) setError(result.error ?? null);
    else setError(null);
  };

  // Top section is a button when the walkthrough guide wants unit detail clicks
  const TopTag = onSelect ? 'button' : 'div';

  return (
    <motion.div
      className={`bg-dfa-surface border rounded-lg overflow-hidden ${quantity > 0 ? 'border-dfa-border border-l-2 border-l-dfa-red' : 'border-dfa-border'}`}
      whileHover={{ borderColor: '#8B1A1A' }}
      layout
    >
      {/* Clickable top section (image + stats) — activates when walkthrough is open */}
      <TopTag
        {...(onSelect
          ? {
              onClick: () => onSelect(unit),
              'aria-label': `View ${unit.name} details in guide`,
              className: 'block w-full text-left hover:bg-dfa-surface-raised transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-dfa-red',
            }
          : {})}
      >
        {/* Unit image */}
        <div className="relative h-32 bg-dfa-black">
          {unit.image_url ? (
            <img
              src={unit.image_url}
              alt={unit.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <span className="text-4xl">⚔</span>
            </div>
          )}
          <span className="absolute top-2 right-2 text-xs font-mono text-dfa-gold font-bold">
            {unit.points}pts
          </span>
          <RoleBadge role={unit.role} />
          {quantity > 0 && (
            <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-dfa-red text-white px-1.5 py-0.5 rounded font-mono">
              ×{quantity}
            </span>
          )}
        </div>

        {/* Name + stat block */}
        <div className="p-3">
          <h3 className="font-display text-dfa-text font-bold text-lg leading-tight mb-2">
            {unit.name}
          </h3>
          <StatBlock
            actions={unit.actions}
            movement={unit.movement}
            melee_attack={unit.melee_attack}
            ranged_attack={unit.ranged_attack}
            defence={unit.defence}
            health={unit.health}
          />
        </div>
      </TopTag>

      {/* Expandable abilities + weapons */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-3 py-2 text-xs text-dfa-text-muted hover:text-dfa-text flex items-center justify-between border-t border-dfa-border transition-colors"
      >
        <span>Abilities &amp; Weapons</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-dfa-border space-y-3">
              <AbilityList abilities={unit.abilities} />
              <WeaponTable weapons={unit.weapons} />
              {unit.store_url && (
                <a
                  href={unit.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-dfa-text-muted hover:text-dfa-gold transition-colors text-center pt-1"
                >
                  View on Store ↗
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation error */}
      {error && (
        <p className="px-3 pb-1 text-xs text-red-400">{error}</p>
      )}

      {/* Add button */}
      <div className="p-3 pt-0">
        <button
          onClick={handleAdd}
          className="w-full py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
        >
          {quantity > 0 ? `Add Another (×${quantity})` : 'Add to Army'}
        </button>
      </div>
    </motion.div>
  );
}
