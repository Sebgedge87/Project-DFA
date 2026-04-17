import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Plus } from 'lucide-react';
import { useFactions, useMyLists, useTemplateLists, useCloneList } from '@dfa/supabase-client';
import { FactionCard } from '../components/faction/FactionCard';
import { FactionDetailModal } from '../components/faction/FactionDetailModal';
import { WalkthroughBanner } from '../components/ui/WalkthroughBanner';
import { CommunityBanner } from '../components/ui/CommunityBanner';
import { useWalkthrough } from '../hooks/useWalkthrough';
import { useArmyStore } from '../stores/armyStore';
import { useAuthStore } from '../stores/authStore';
import type { Faction } from '@dfa/types';

export default function HomePage() {
  const { data: factions, isLoading, error } = useFactions();
  const { user } = useAuthStore();
  const { data: myLists } = useMyLists(user?.id ?? null);
  const { data: templateLists } = useTemplateLists();
  const cloneList = useCloneList();
  const { faction: selectedFaction, setFaction, loadList } = useArmyStore();
  const { dismissed, dismiss } = useWalkthrough(user?.id ?? null);
  const navigate = useNavigate();
  const [detailFaction, setDetailFaction] = useState<Faction | null>(null);

  const loadAndNavigate = async (id: string) => {
    await loadList(id);
    const slug = useArmyStore.getState().faction?.slug;
    navigate(slug ? `/builder/${slug}` : '/');
  };

  const handleBuild = (faction: Faction) => {
    dismiss();
    setFaction(faction);
    setDetailFaction(null);
    setPickingFaction(false);
    navigate(`/builder/${faction.slug}`);
  };

  const hasArmies = !!myLists?.length;
  const [pickingFaction, setPickingFaction] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-dfa-text-muted text-sm animate-pulse">Loading…</div>
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

      {/* Community scrolling banner — always at top */}
      <CommunityBanner />

      {/* My Armies — shown when user has saved armies */}
      {hasArmies ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-dfa-text text-3xl font-bold uppercase tracking-wide">
              My Armies
            </h1>
            <button
              onClick={() => { setPickingFaction(p => !p); }}
              className="flex items-center gap-2 px-3 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
            >
              <Plus size={15} />
              {pickingFaction ? 'Cancel' : 'New Army'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
            {myLists.map(list => (
              <div
                key={list.id}
                className="bg-dfa-surface border border-dfa-border rounded-lg p-4 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-dfa-text font-medium truncate">{list.name}</p>
                  <p className="text-xs text-dfa-gold font-mono mt-0.5">{list.points_total}pts</p>
                </div>
                <button
                  onClick={() => loadAndNavigate(list.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors shrink-0"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* Faction picker — only shown when user explicitly clicks New Army */}
          {pickingFaction && (
            <div className="border-t border-dfa-border pt-6 mb-4">
              <h2 className="font-display text-dfa-text text-xl font-bold uppercase tracking-wide mb-1">
                Choose a Faction
              </h2>
              <p className="text-dfa-text-muted text-sm mb-4">Pick a faction to start your new army.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {factions?.map(faction => (
                  <FactionCard
                    key={faction.id}
                    faction={faction}
                    onSelect={setDetailFaction}
                    isSelected={selectedFaction?.id === faction.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No armies — show faction selector as primary CTA */
        <div>
          <div className="mb-6">
            <h1 className="font-display text-dfa-text text-3xl font-bold uppercase tracking-wide">
              Choose Your Faction
            </h1>
            <p className="text-dfa-text-muted text-sm mt-1">
              Select a faction to start building your 1,000 point army.
            </p>
          </div>

          {!dismissed && (
            <div className="mb-5">
              <WalkthroughBanner
                message="Welcome to the Army Builder! Pick a faction below to get started. Click any card to see the full roster and rules links before committing."
                onDismiss={dismiss}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {factions?.map(faction => (
              <FactionCard
                key={faction.id}
                faction={faction}
                onSelect={setDetailFaction}
                isSelected={selectedFaction?.id === faction.id}
              />
            ))}
          </div>
        </div>
      )}

      {templateLists && templateLists.length > 0 && (
        <div className="mt-8 border-t border-dfa-border pt-6">
          <h2 className="font-display text-dfa-text text-xl font-bold uppercase tracking-wide mb-1">Starter Armies</h2>
          <p className="text-dfa-text-muted text-sm mb-4">Clone a pre-built list to get started fast.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {templateLists.map(tmpl => (
              <div key={tmpl.id} className="bg-dfa-surface border border-dfa-border rounded-lg p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-dfa-text font-medium truncate">{tmpl.name}</p>
                  <p className="text-xs text-dfa-gold font-mono mt-0.5">{tmpl.points_total}pts</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`/share/${tmpl.share_token}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors">
                    View
                  </a>
                  {user && (
                    <button
                      onClick={async () => {
                        const id = await cloneList.mutateAsync({ templateId: tmpl.id, userId: user.id });
                        await loadAndNavigate(id);
                      }}
                      disabled={cloneList.isPending}
                      className="px-3 py-1.5 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                    >
                      Use
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FactionDetailModal
        faction={detailFaction}
        open={!!detailFaction}
        onOpenChange={open => { if (!open) setDetailFaction(null); }}
        onBuild={handleBuild}
      />
    </div>
  );
}
