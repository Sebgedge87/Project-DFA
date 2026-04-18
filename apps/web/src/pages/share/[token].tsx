import { useParams, Link } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';
import { useShareList } from '@dfa/supabase-client';
import { StatBlock } from '../../components/unit/StatBlock';
import { WeaponTable } from '../../components/unit/WeaponTable';
import { AbilityList } from '../../components/unit/AbilityList';
import { exportRosterPdf } from '../../utils/exportRosterPdf';
import type { ArmyEntry } from '@dfa/types';

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useShareList(token ?? null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dfa-black flex items-center justify-center">
        <p className="text-dfa-text-muted text-sm animate-pulse">Loading army…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-dfa-black flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-dfa-text text-lg font-display font-bold">Army not found</p>
          <p className="text-dfa-text-muted text-sm">This list may be private or the link has expired.</p>
          <Link to="/" className="inline-block px-4 py-2 bg-dfa-red text-white text-sm font-bold rounded hover:bg-dfa-red-bright transition-colors">
            Build your own
          </Link>
        </div>
      </div>
    );
  }

  const faction = (data as any).faction;
  const entries: ArmyEntry[] = data.army_entries ?? [];

  const handleExport = () => {
    exportRosterPdf({ name: data.name, points_total: data.points_total, faction, army_entries: entries });
  };

  return (
    <div className="min-h-screen bg-dfa-black">
      {/* Header */}
      <div
        className="relative py-12 px-4 md:px-8"
        style={{ background: faction ? `linear-gradient(135deg, #${faction.color_primary}33 0%, #0D0D0D 100%)` : undefined }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-dfa-text-muted text-xs uppercase tracking-widest mb-1">
            {faction?.name ?? 'Army List'}
          </p>
          <h1 className="font-display text-dfa-text text-4xl font-bold uppercase tracking-wide">
            {data.name}
          </h1>
          <p className="text-dfa-gold font-mono font-bold text-lg mt-2">{data.points_total}pts</p>

          <div className="flex gap-3 mt-4 flex-wrap">
            <Link
              to={faction ? `/builder/${faction.slug}` : '/'}
              className="px-4 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
            >
              Build My Own
            </Link>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-dfa-border-neutral text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
            >
              <FileText size={15} />
              Export Roster
            </button>

            <Link
              to="/rules"
              className="flex items-center gap-2 px-4 py-2 border border-dfa-border-neutral text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
            >
              <BookOpen size={15} />
              View Rules
            </Link>
            {faction?.store_url && (
              <a
                href={faction.store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-dfa-border-neutral text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
              >
                Buy Miniatures
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Unit list */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {entries.map((entry: ArmyEntry) => (
          <div key={entry.id} className="bg-dfa-surface border border-dfa-border-neutral rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-dfa-border-neutral flex items-center justify-between">
              <div>
                <span className="font-display text-dfa-text font-bold text-lg">{entry.unit_type.name}</span>
                {entry.quantity > 1 && (
                  <span className="ml-2 text-dfa-text-muted text-sm">×{entry.quantity}</span>
                )}
              </div>
              <span className="text-dfa-gold font-mono font-bold text-sm">
                {entry.unit_type.points * entry.quantity}pts
              </span>
            </div>
            <div className="p-4 space-y-4">
              <StatBlock {...entry.unit_type} />
              {(entry.unit_type.abilities?.length ?? 0) > 0 && (
                <AbilityList abilities={entry.unit_type.abilities} />
              )}
              {(entry.unit_type.weapons?.length ?? 0) > 0 && (
                <WeaponTable weapons={entry.unit_type.weapons} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
