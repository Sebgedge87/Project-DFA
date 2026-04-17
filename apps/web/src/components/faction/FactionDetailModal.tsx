import * as Dialog from '@radix-ui/react-dialog';
import { X, BookOpen, ShoppingBag, Sword } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnitTypes } from '@dfa/supabase-client';
import type { Faction, UnitRole } from '@dfa/types';

interface FactionDetailModalProps {
  faction: Faction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuild: (faction: Faction) => void;
}

const ROLE_ORDER: UnitRole[] = ['captain', 'specialist', 'core'];
const ROLE_LABEL: Record<UnitRole, string> = {
  captain: 'Captains',
  specialist: 'Specialists',
  core: 'Core',
};

export function FactionDetailModal({ faction, open, onOpenChange, onBuild }: FactionDetailModalProps) {
  const { data: units, isLoading } = useUnitTypes(faction?.id ?? null);

  if (!faction) return null;

  const byRole = ROLE_ORDER.reduce<Record<UnitRole, typeof units>>((acc, role) => {
    acc[role] = units?.filter(u => u.role === role) ?? [];
    return acc;
  }, {} as any);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-dfa-surface border border-dfa-border rounded-lg shadow-xl flex flex-col overflow-hidden">

          {/* Hero header */}
          <div
            className="relative h-36 shrink-0 flex items-end p-5"
            style={{ background: `linear-gradient(135deg, #${faction.color_primary}55 0%, #0D0D0D 100%)` }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-0.5">{faction.tagline}</p>
              <Dialog.Title className="font-display text-dfa-text text-3xl font-bold uppercase tracking-wide leading-none">
                {faction.name}
              </Dialog.Title>
            </div>
            <Dialog.Close className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* Lore */}
            {faction.lore && (
              <p className="text-dfa-text-muted text-sm leading-relaxed">{faction.lore}</p>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-2">
              <Link
                to="/rules"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-2 px-3 py-2 border border-dfa-border rounded text-xs text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted transition-colors"
              >
                <BookOpen size={13} />
                View Rules
              </Link>
              {faction.store_url && (
                <a
                  href={faction.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 border border-dfa-border rounded text-xs text-dfa-text-muted hover:text-dfa-text hover:border-dfa-text-muted transition-colors"
                >
                  <ShoppingBag size={13} />
                  Buy Miniatures
                </a>
              )}
            </div>

            {/* Roster */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-dfa-text-muted font-medium mb-3 flex items-center gap-2">
                <Sword size={12} />
                Roster
              </h3>

              {isLoading ? (
                <p className="text-dfa-text-muted text-xs animate-pulse">Loading roster…</p>
              ) : (
                <div className="space-y-4">
                  {ROLE_ORDER.map(role => {
                    const roleUnits = byRole[role];
                    if (!roleUnits?.length) return null;
                    return (
                      <div key={role}>
                        <p className="text-xs font-bold uppercase tracking-wider text-dfa-text mb-2">
                          {ROLE_LABEL[role]}
                        </p>
                        <div className="space-y-1">
                          {roleUnits.map(u => (
                            <div
                              key={u.id}
                              className="flex items-center justify-between px-3 py-2 bg-dfa-black rounded text-sm"
                            >
                              <span className="text-dfa-text">{u.name}</span>
                              <div className="flex items-center gap-4 text-xs font-mono">
                                <span className="text-dfa-text-muted">
                                  {u.actions}A · {u.movement}" · {u.health}HP
                                </span>
                                <span className="text-dfa-gold font-bold">{u.points}pts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-dfa-border shrink-0">
            <button
              onClick={() => onBuild(faction)}
              className="w-full py-3 bg-dfa-red hover:bg-dfa-red-bright text-white font-bold rounded transition-colors font-display uppercase tracking-wide"
            >
              Build Army
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
