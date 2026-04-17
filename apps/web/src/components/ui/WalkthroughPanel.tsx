import { useEffect, useRef, type RefObject } from 'react';
import { X, ChevronRight, ChevronLeft, Check, ArrowLeft } from 'lucide-react';
import type { ArmyEntry, Faction, UnitType } from '@dfa/types';
import { POINTS_LIMIT } from '@dfa/logic';

const TOTAL_STEPS = 4;

interface WalkthroughPanelProps {
  open: boolean;
  currentStep: number;
  selectedUnit: UnitType | null;
  faction: Faction | null;
  entries: ArmyEntry[];
  listName: string;
  isSaving: boolean;
  onClose: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onClearUnit: () => void;
  onFinish: () => Promise<void>;
  triggerRef?: RefObject<HTMLButtonElement>;
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all ${
            i + 1 < current
              ? 'w-2 h-2 bg-dfa-red/60'
              : i + 1 === current
              ? 'w-2.5 h-2.5 bg-dfa-red'
              : 'w-2 h-2 bg-dfa-border'
          }`}
        />
      ))}
    </div>
  );
}

function RolePill({ role }: { role: string }) {
  const colours: Record<string, string> = {
    captain:    'bg-dfa-red/20 text-dfa-red border-dfa-red/30',
    specialist: 'bg-dfa-gold/20 text-dfa-gold border-dfa-gold/30',
    core:       'bg-dfa-text-muted/10 text-dfa-text-muted border-dfa-border',
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${colours[role] ?? 'bg-dfa-surface border-dfa-border text-dfa-text-muted'}`}>
      {role}
    </span>
  );
}

// ── Step content ───────────────────────────────────────────────────────────

function StepOne({ faction }: { faction: Faction | null }) {
  return (
    <div className="p-4 space-y-3">
      <h2 className="font-display text-dfa-text font-bold text-base uppercase tracking-wide">
        Choose your faction
      </h2>
      <p className="text-dfa-text-muted text-sm leading-relaxed">
        Each faction brings unique warriors from across the far future. Your
        choice determines which units you can recruit and shapes how your army
        plays on the battlefield.
      </p>
      {faction ? (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold"
          style={{
            borderColor: `#${faction.color_primary}`,
            color: `#${faction.color_primary}`,
            background: `#${faction.color_primary}22`,
          }}
        >
          <Check size={13} />
          {faction.name}
        </div>
      ) : (
        <p className="text-sm text-dfa-gold">Select a faction to continue.</p>
      )}
      {faction && (
        <p className="text-xs text-dfa-text-muted">
          Your faction is locked in — time to build your roster.
        </p>
      )}
    </div>
  );
}

function StepTwo({ hasCaptain }: { hasCaptain: boolean }) {
  return (
    <div className="p-4 space-y-3">
      <h2 className="font-display text-dfa-text font-bold text-base uppercase tracking-wide">
        Every army needs a leader
      </h2>
      <p className="text-dfa-text-muted text-sm leading-relaxed">
        A Captain is required in every army. They count toward your{' '}
        {POINTS_LIMIT.toLocaleString()} point limit and determine the tone of
        your warband, so choose one that fits your strategy.
      </p>
      {hasCaptain ? (
        <div className="flex items-center gap-2 text-sm font-bold text-dfa-red">
          <Check size={15} /> Captain added!
        </div>
      ) : (
        <p className="text-sm text-dfa-gold">
          Add a Captain unit from the roster to continue.
        </p>
      )}
    </div>
  );
}

function StepThree({ hasCaptain, entries, totalModels }: { hasCaptain: boolean; entries: ArmyEntry[]; totalModels: number }) {
  const captainModels = entries.find(e => e.unit_type.role === 'captain')?.quantity ?? 0;
  const otherModels = totalModels - captainModels;
  const needed = Math.max(0, 3 - otherModels);
  const ready = hasCaptain && totalModels >= 4;

  return (
    <div className="p-4 space-y-3">
      <h2 className="font-display text-dfa-text font-bold text-base uppercase tracking-wide">
        Fill your ranks
      </h2>
      <p className="text-dfa-text-muted text-sm leading-relaxed">
        Bolster your Captain with Specialists and Core troops. Your army must
        reach at least 5 models total to be valid — and stay within the{' '}
        {POINTS_LIMIT.toLocaleString()} point limit.
      </p>

      <div className="bg-dfa-black rounded-lg p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-dfa-text-muted">Models in army</span>
          <span className="font-mono font-bold text-dfa-text">{totalModels}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-dfa-text-muted">Entries</span>
          <span className="font-mono font-bold text-dfa-text">{entries.length}</span>
        </div>
      </div>

      {ready ? (
        <div className="flex items-center gap-2 text-sm font-bold text-dfa-red">
          <Check size={15} /> Roster filled!
        </div>
      ) : (
        <p className="text-sm text-dfa-gold">
          {!hasCaptain
            ? 'Add a Captain first.'
            : `Add ${needed} more unit${needed !== 1 ? 's' : ''} to continue.`}
        </p>
      )}
    </div>
  );
}

function StepFour({ listName }: { listName: string }) {
  const named = listName.trim() !== '';
  return (
    <div className="p-4 space-y-3">
      <h2 className="font-display text-dfa-text font-bold text-base uppercase tracking-wide">
        Name your army
      </h2>
      <p className="text-dfa-text-muted text-sm leading-relaxed">
        Give your warband a name before saving. Find the name field at the top of
        the army panel on the right — your army's identity starts here.
      </p>
      {named ? (
        <div className="flex items-center gap-2 text-sm">
          <Check size={15} className="text-dfa-red shrink-0" />
          <span className="text-dfa-text font-bold truncate">"{listName}"</span>
        </div>
      ) : (
        <p className="text-sm text-dfa-gold">
          Enter a name in the text field above your army list to continue.
        </p>
      )}
    </div>
  );
}

// ── Unit detail view ────────────────────────────────────────────────────────

function UnitDetailView({ unit, onBack }: { unit: UnitType; onBack: () => void }) {
  const MAX_ABILITIES = 4;
  const visible = unit.abilities.slice(0, MAX_ABILITIES);
  const overflow = unit.abilities.length - MAX_ABILITIES;

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-dfa-text-muted hover:text-dfa-text transition-colors"
      >
        <ArrowLeft size={13} /> Back to guide
      </button>

      <div>
        <h2 className="font-display text-dfa-text font-bold text-lg uppercase tracking-wide leading-tight">
          {unit.name}
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <RolePill role={unit.role} />
          <span className="text-dfa-gold font-mono text-sm font-bold">{unit.points}pts</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Act',    value: unit.actions },
          { label: 'Move',   value: `${unit.movement}"` },
          { label: 'HP',     value: unit.health },
          { label: 'Melee',  value: unit.melee_attack },
          { label: 'Ranged', value: unit.ranged_attack },
          { label: 'Def',    value: unit.defence },
        ].map(({ label, value }) => (
          <div key={label} className="bg-dfa-black rounded p-2 text-center">
            <p className="text-[10px] text-dfa-text-muted uppercase tracking-wider leading-none mb-1">
              {label}
            </p>
            <p className="text-sm font-mono font-bold text-dfa-text">{value}</p>
          </div>
        ))}
      </div>

      {unit.abilities.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-dfa-text-muted font-medium mb-2">
            Special Rules
          </p>
          <ul className="space-y-2">
            {visible.map(ability => (
              <li key={ability.name} className="text-xs text-dfa-text-muted leading-relaxed">
                <span className="font-bold text-dfa-text">{ability.name}:</span>{' '}
                {ability.description}
              </li>
            ))}
            {overflow > 0 && (
              <li className="text-xs text-dfa-text-muted italic">
                +{overflow} more — expand the unit card to view all rules.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main panel ──────────────────────────────────────────────────────────────

export function WalkthroughPanel({
  open,
  currentStep,
  selectedUnit,
  faction,
  entries,
  listName,
  isSaving,
  onClose,
  onNextStep,
  onPrevStep,
  onClearUnit,
  onFinish,
  triggerRef,
}: WalkthroughPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = 'walkthrough-panel-heading';

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else {
      triggerRef?.current?.focus();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasCaptain  = entries.some(e => e.unit_type.role === 'captain');
  const totalModels = entries.reduce((s, e) => s + e.quantity, 0);

  const canAdvance = [
    faction !== null,
    hasCaptain,
    hasCaptain && totalModels >= 4,
    listName.trim() !== '',
  ][currentStep - 1] ?? true;

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div
      ref={panelRef}
      role="complementary"
      aria-label="Army building guide"
      aria-hidden={!open}
      tabIndex={-1}
      className={[
        // Base — always fixed, slide in/out
        'fixed z-40 flex flex-col bg-dfa-surface border-dfa-border shadow-xl outline-none',
        'transition-transform duration-300',
        // Mobile / tablet: bottom drawer
        'bottom-20 md:bottom-0 left-0 right-0 max-h-[50vh]',
        'border-t rounded-t-xl',
        // Desktop (lg+): right-side panel
        'lg:top-0 lg:bottom-auto lg:left-auto lg:right-0 lg:h-full lg:w-[280px] lg:max-h-none',
        'lg:border-t-0 lg:border-l lg:rounded-none',
        // Open / closed transforms
        open
          ? 'translate-y-0 lg:translate-x-0'
          : 'translate-y-full lg:translate-y-0 lg:translate-x-full',
      ].join(' ')}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-dfa-border">
        <div className="flex items-center gap-3">
          <p
            id={headingId}
            className="font-display text-dfa-text font-bold uppercase tracking-wide text-sm"
          >
            {selectedUnit ? 'Unit Details' : 'New Player Guide'}
          </p>
          {!selectedUnit && <StepDots current={currentStep} />}
        </div>
        <button
          onClick={onClose}
          aria-label="Close guide panel"
          className="text-dfa-text-muted hover:text-dfa-text transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {selectedUnit ? (
          <UnitDetailView unit={selectedUnit} onBack={onClearUnit} />
        ) : currentStep === 1 ? (
          <StepOne faction={faction} />
        ) : currentStep === 2 ? (
          <StepTwo hasCaptain={hasCaptain} />
        ) : currentStep === 3 ? (
          <StepThree hasCaptain={hasCaptain} entries={entries} totalModels={totalModels} />
        ) : (
          <StepFour listName={listName} />
        )}
      </div>

      {/* Footer nav (hidden when viewing unit detail) */}
      {!selectedUnit && (
        <div className="shrink-0 px-4 py-3 border-t border-dfa-border flex items-center justify-between gap-2">
          <span className="text-xs text-dfa-text-muted shrink-0">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={onPrevStep}
                className="flex items-center gap-1 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
              >
                <ChevronLeft size={13} /> Back
              </button>
            )}
            {isLastStep ? (
              <button
                onClick={onFinish}
                disabled={!canAdvance || isSaving}
                className="flex items-center gap-1 px-3 py-1.5 bg-dfa-red hover:bg-dfa-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors"
              >
                <Check size={13} />
                {isSaving ? 'Saving…' : 'Save army & finish'}
              </button>
            ) : (
              <button
                onClick={onNextStep}
                disabled={!canAdvance}
                className="flex items-center gap-1 px-3 py-1.5 bg-dfa-red hover:bg-dfa-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
