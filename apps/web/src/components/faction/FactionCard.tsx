import { motion } from 'framer-motion';
import type { Faction } from '@dfa/types';

interface FactionCardProps {
  faction:      Faction;
  onSelect:     (faction: Faction) => void;
  isSelected?:  boolean;
}

export function FactionCard({ faction, onSelect, isSelected = false }: FactionCardProps) {
  return (
    <motion.div
      className={`bg-dfa-surface border rounded-lg overflow-hidden cursor-pointer transition-colors ${
        isSelected ? 'border-dfa-red' : 'border-dfa-border'
      }`}
      whileHover={{ borderColor: '#8B1A1A' }}
      onClick={() => onSelect(faction)}
      layout
    >
      {/* Hero image */}
      <div className="h-40 bg-dfa-black overflow-hidden">
        {faction.image_url ? (
          <img src={faction.image_url} alt={faction.name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-end p-3"
            style={{ background: `linear-gradient(135deg, #${faction.color_primary} 0%, #0D0D0D 100%)` }}
          >
            <span className="text-xs text-white/40 uppercase tracking-widest font-display">
              {faction.slug}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="font-display text-dfa-text font-bold text-xl leading-tight mb-1">
          {faction.name}
        </h2>
        {faction.tagline && (
          <p className="text-dfa-gold text-xs font-medium mb-2">{faction.tagline}</p>
        )}
        {faction.lore && (
          <p className="text-dfa-text-muted text-xs leading-relaxed line-clamp-2">{faction.lore}</p>
        )}

        <button
          onClick={e => { e.stopPropagation(); onSelect(faction); }}
          className={`mt-4 w-full py-2 text-sm font-bold rounded transition-colors ${
            isSelected
              ? 'bg-dfa-red-bright text-white cursor-default'
              : 'bg-dfa-surface border border-dfa-border text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted'
          }`}
        >
          {isSelected ? 'Selected' : 'View Details →'}
        </button>
      </div>
    </motion.div>
  );
}
