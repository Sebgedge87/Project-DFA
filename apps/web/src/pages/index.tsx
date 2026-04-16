import { useNavigate } from 'react-router-dom';
import { useFactions } from '@dfa/supabase-client';
import { FactionCard } from '../components/faction/FactionCard';
import { useArmyStore } from '../stores/armyStore';
import type { Faction } from '@dfa/types';

export default function HomePage() {
  const { data: factions, isLoading, error } = useFactions();
  const { faction: selectedFaction, setFaction } = useArmyStore();
  const navigate = useNavigate();

  const handleSelect = (faction: Faction) => {
    setFaction(faction);
    navigate(`/builder/${faction.slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-dfa-text-muted text-sm animate-pulse">Loading factions…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm">Failed to load factions. Check your connection.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-dfa-text text-3xl font-bold uppercase tracking-wide">
          Choose Your Faction
        </h1>
        <p className="text-dfa-text-muted text-sm mt-1">
          Select a faction to start building your 1,000 point army.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {factions?.map((faction) => (
          <FactionCard
            key={faction.id}
            faction={faction}
            onSelect={handleSelect}
            isSelected={selectedFaction?.id === faction.id}
          />
        ))}
      </div>
    </div>
  );
}
