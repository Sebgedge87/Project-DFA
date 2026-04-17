import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, Check, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useFactions, useUnitTypes, useUpdateProfile } from '@dfa/supabase-client';
import { useWalkthroughStore } from '../../stores/walkthroughStore';
import { useArmyStore } from '../../stores/armyStore';
import { useAuthStore } from '../../stores/authStore';
import { StatBlock } from '../unit/StatBlock';
import { AbilityList } from '../unit/AbilityList';
import type { Faction, UnitType } from '@dfa/types';

const POINTS_LIMIT = 1000;
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// ─── Step progress ────────────────────────────────────────────────────────────

const STEP_LABELS = ['Faction', 'Captain', 'Specialists', 'Core', 'Review', 'Name'];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs text-dfa-text-muted shrink-0">Step {current} of 6</span>
      <div className="flex gap-1.5">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <span
              key={step}
              aria-label={`Step ${step}: ${label}${active ? ' (current)' : done ? ' (complete)' : ''}`}
              aria-current={active ? 'true' : undefined}
              className={`w-2 h-2 rounded-full transition-colors ${
                done ? 'bg-dfa-red' : active ? 'bg-dfa-gold' : 'bg-dfa-border'
              }`}
            />
          );
        })}
      </div>
      <span className="text-xs text-dfa-text font-bold truncate hidden sm:block">
        {STEP_LABELS[current - 1]}
      </span>
    </div>
  );
}

// ─── Faction card (step 1) ────────────────────────────────────────────────────

function FactionCard({ faction, selected, expanded, onToggle, onSelect }: {
  faction: Faction;
  selected: boolean;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (f: Faction) => void;
}) {
  return (
    <div className={`rounded-lg border transition-colors overflow-hidden ${
      selected ? 'border-dfa-red bg-dfa-surface' : 'border-dfa-border bg-dfa-surface hover:border-dfa-text-muted'
    }`}>
      <button
        onClick={onToggle}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        {faction.image_url && (
          <img
            src={faction.image_url}
            alt={faction.name}
            className="w-full h-28 object-cover object-top"
          />
        )}
        <div
          className="px-3 py-2.5"
          style={{ borderTop: `3px solid #${faction.color_primary}` }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-display font-bold text-dfa-text text-sm uppercase tracking-wide">{faction.name}</p>
            {selected && <Check size={13} className="text-dfa-red shrink-0" />}
          </div>
          {faction.tagline && (
            <p className="text-[10px] text-dfa-text-muted mt-0.5 leading-tight">{faction.tagline}</p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-dfa-border space-y-3">
          {faction.lore && (
            <p className="text-xs text-dfa-text-muted leading-relaxed pt-3">{faction.lore}</p>
          )}
          <button
            onClick={() => onSelect(faction)}
            className="w-full py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors"
          >
            {selected ? '✓ Selected' : 'Select this faction'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Unit card (steps 2–4) ────────────────────────────────────────────────────

function UnitCard({ unit, expanded, inArmy, qty, onToggle, onAdd, onAdjust, isCaptainStep }: {
  unit: UnitType;
  expanded: boolean;
  inArmy: boolean;
  qty: number;
  onToggle: () => void;
  onAdd: (u: UnitType) => void;
  onAdjust: (id: string, delta: 1 | -1) => void;
  isCaptainStep: boolean;
}) {
  return (
    <div className={`rounded-lg border transition-colors overflow-hidden ${
      inArmy ? 'border-dfa-red bg-dfa-surface' : 'border-dfa-border bg-dfa-surface hover:border-dfa-text-muted'
    }`}>
      <button onClick={onToggle} className="w-full text-left px-3 py-2.5" aria-expanded={expanded}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-dfa-text text-sm truncate">{unit.name}</p>
            <p className="text-[10px] text-dfa-gold font-mono mt-0.5">{unit.points}pts</p>
          </div>
          {inArmy && (
            <span className="text-xs text-dfa-red font-bold shrink-0">
              {isCaptainStep ? '✓' : `×${qty}`}
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-dfa-border space-y-3 pt-3">
          {unit.description && (
            <p className="text-xs text-dfa-text-muted leading-relaxed italic">{unit.description}</p>
          )}
          <StatBlock {...unit} />
          {(unit.abilities?.length ?? 0) > 0 && (
            <AbilityList abilities={(unit.abilities ?? []).slice(0, 4)} />
          )}
          {isCaptainStep ? (
            <button
              onClick={() => onAdd(unit)}
              className="w-full py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors"
            >
              {inArmy ? '✓ Captain selected' : 'Add as Captain'}
            </button>
          ) : inArmy ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdjust(unit.id, -1)}
                className="w-7 h-7 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm text-dfa-text font-mono w-5 text-center">{qty}</span>
              <button
                onClick={() => onAdjust(unit.id, 1)}
                className="w-7 h-7 rounded border border-dfa-border text-dfa-text-muted hover:text-dfa-text flex items-center justify-center transition-colors"
              >
                <Plus size={12} />
              </button>
              <span className="text-xs text-dfa-text-muted ml-1">{unit.points * qty}pts total</span>
            </div>
          ) : (
            <button
              onClick={() => onAdd(unit)}
              className="w-full py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors"
            >
              Add to army
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 1: Choose faction ───────────────────────────────────────────────────

function StepFaction() {
  const { data: factions, isLoading } = useFactions();
  const { selectedFaction, expandedFactionId, setSelectedFaction, toggleExpandFaction } = useWalkthroughStore();

  if (isLoading) return <p className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">Loading factions…</p>;

  return (
    <div className="space-y-5">
      <div>
        <h2 id="wt-heading" className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">Choose your faction</h2>
        <p className="text-dfa-text-muted text-sm mt-1 leading-relaxed">
          Every army in Death Fields Arena belongs to a faction. Your faction determines which units you can recruit and how your warband fights. Click any card to learn more before committing.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {factions?.map(f => (
          <FactionCard
            key={f.id}
            faction={f}
            selected={selectedFaction?.id === f.id}
            expanded={expandedFactionId === f.id}
            onToggle={() => toggleExpandFaction(f.id)}
            onSelect={setSelectedFaction}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Steps 2–4: Unit selection ────────────────────────────────────────────────

function StepUnits({ role, heading, lore, isCaptainStep, canSkip }: {
  role: 'captain' | 'specialist' | 'core';
  heading: string;
  lore: string;
  isCaptainStep: boolean;
  canSkip?: boolean;
}) {
  const { selectedFaction, expandedUnitId, walkthroughUnits, step3Skipped,
    addCaptain, addUnit, removeUnit, adjustQuantity, toggleExpandUnit, skipStep3 } = useWalkthroughStore();
  const { data: units, isLoading } = useUnitTypes(selectedFaction?.id ?? null);

  const roleUnits = units?.filter(u => u.role === role) ?? [];
  const totalPoints = walkthroughUnits.reduce((s, wu) => s + wu.unitType.points * wu.quantity, 0);

  if (isLoading) return <p className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">Loading units…</p>;

  return (
    <div className="space-y-5">
      <div>
        <h2 id="wt-heading" className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">{heading}</h2>
        <p className="text-dfa-text-muted text-sm mt-1 leading-relaxed">{lore}</p>
      </div>

      {roleUnits.length === 0 ? (
        <p className="text-dfa-text-muted text-sm py-4 text-center">No {role} units available for this faction.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roleUnits.map(unit => {
            const wu = walkthroughUnits.find(w => w.unitType.id === unit.id);
            return (
              <UnitCard
                key={unit.id}
                unit={unit}
                expanded={expandedUnitId === unit.id}
                inArmy={!!wu}
                qty={wu?.quantity ?? 0}
                onToggle={() => toggleExpandUnit(unit.id)}
                onAdd={isCaptainStep ? addCaptain : addUnit}
                onAdjust={adjustQuantity}
                isCaptainStep={isCaptainStep}
              />
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-dfa-border">
        <p className="text-xs text-dfa-text-muted">
          <span className="text-dfa-gold font-mono font-bold">{totalPoints}</span>
          {' / '}{POINTS_LIMIT}pts used
        </p>
        {canSkip && !step3Skipped && !walkthroughUnits.some(wu => wu.unitType.role === 'specialist') && (
          <button onClick={skipStep3} className="text-xs text-dfa-text-muted hover:text-dfa-text transition-colors underline underline-offset-2">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────

function StepReview() {
  const { walkthroughUnits, removeUnit } = useWalkthroughStore();
  const totalPoints = walkthroughUnits.reduce((s, wu) => s + wu.unitType.points * wu.quantity, 0);
  const overLimit = totalPoints > POINTS_LIMIT;

  const grouped: Record<string, typeof walkthroughUnits> = {};
  for (const wu of walkthroughUnits) {
    const role = wu.unitType.role;
    if (!grouped[role]) grouped[role] = [];
    grouped[role].push(wu);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 id="wt-heading" className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">Your warband</h2>
        <p className="text-dfa-text-muted text-sm mt-1">Review your selections before naming your army.</p>
      </div>

      {overLimit && (
        <div role="alert" className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-xs text-red-400">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>Your army exceeds {POINTS_LIMIT}pts. Remove units to continue.</span>
        </div>
      )}

      {walkthroughUnits.length === 0 ? (
        <p className="text-dfa-text-muted text-sm py-4 text-center">No units added yet. Go back to add some.</p>
      ) : (
        <div className="space-y-4">
          {(['captain', 'specialist', 'core'] as const).map(role => {
            const group = grouped[role];
            if (!group?.length) return null;
            return (
              <div key={role}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-dfa-text-muted mb-2">{role}s</p>
                <div className="space-y-1">
                  {group.map(wu => (
                    <div key={wu.unitType.id} className="flex items-center gap-2 py-1.5 px-3 bg-dfa-black rounded">
                      <span className="flex-1 text-sm text-dfa-text font-medium truncate">
                        {wu.unitType.name}{wu.quantity > 1 ? ` ×${wu.quantity}` : ''}
                      </span>
                      <span className="text-xs text-dfa-gold font-mono shrink-0">{wu.unitType.points * wu.quantity}pts</span>
                      <button
                        onClick={() => removeUnit(wu.unitType.id)}
                        aria-label={`Remove ${wu.unitType.name}`}
                        className="text-dfa-text-muted hover:text-red-400 transition-colors shrink-0"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={`flex items-center justify-between pt-3 border-t font-mono text-sm font-bold ${
        overLimit ? 'border-red-500/40 text-red-400' : 'border-dfa-border text-dfa-gold'
      }`}>
        <span>Total</span>
        <span>{totalPoints} / {POINTS_LIMIT}pts</span>
      </div>
    </div>
  );
}

// ─── Step 6: Name ─────────────────────────────────────────────────────────────

function StepName() {
  const { armyName, setArmyName } = useWalkthroughStore();
  return (
    <div className="space-y-5">
      <div>
        <h2 id="wt-heading" className="font-display text-dfa-text text-2xl font-bold uppercase tracking-wide">Name your warband</h2>
        <p className="text-dfa-text-muted text-sm mt-1 leading-relaxed">
          Your army will be known by this name in Death Fields Arena. Choose well — glory and infamy await.
        </p>
      </div>
      <div>
        <label htmlFor="wt-army-name" className="block text-xs text-dfa-text-muted mb-1.5">Army name</label>
        <input
          id="wt-army-name"
          type="text"
          value={armyName}
          onChange={e => setArmyName(e.target.value)}
          placeholder="e.g. The Iron Tide"
          maxLength={80}
          className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-2 text-sm text-dfa-text focus:outline-none focus:border-dfa-red"
          autoFocus
        />
      </div>
    </div>
  );
}

// ─── Close confirmation overlay ───────────────────────────────────────────────

function ConfirmClose({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="absolute inset-0 bg-dfa-black/90 z-10 flex flex-col items-center justify-center gap-5 p-6 rounded-xl">
      <p className="text-dfa-text font-display font-bold text-lg uppercase tracking-wide text-center">
        Leave the guide?
      </p>
      <p className="text-dfa-text-muted text-sm text-center">
        Your progress won't be saved. You can restart the guide any time from the builder header.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
        >
          Keep going
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-dfa-surface border border-dfa-border text-dfa-text-muted hover:text-red-400 text-sm rounded transition-colors"
        >
          Yes, close
        </button>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function WalkthroughModal() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const {
    isOpen, currentStep, selectedFaction, walkthroughUnits, armyName, step3Skipped, confirmClose,
    forceClose, askClose, cancelClose, nextStep, prevStep,
  } = useWalkthroughStore();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    closeButtonRef.current?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { askClose(); return; }
      if (e.key !== 'Tab') return;
      const els = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', trap);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trap);
    };
  }, [isOpen, askClose]);

  const totalPoints = walkthroughUnits.reduce((s, wu) => s + wu.unitType.points * wu.quantity, 0);

  const gates: Record<number, boolean> = {
    1: selectedFaction !== null,
    2: walkthroughUnits.some(wu => wu.unitType.role === 'captain'),
    3: walkthroughUnits.some(wu => wu.unitType.role === 'specialist') || step3Skipped,
    4: walkthroughUnits.filter(wu => wu.unitType.role === 'core').reduce((s, wu) => s + wu.quantity, 0) >= 2,
    5: totalPoints <= POINTS_LIMIT,
    6: armyName.trim().length > 0,
  };

  const handleFinish = async () => {
    if (!selectedFaction || !user) return;
    const army = useArmyStore.getState();
    army.setFaction(selectedFaction);
    army.setName(armyName);
    for (const wu of walkthroughUnits) {
      for (let i = 0; i < wu.quantity; i++) {
        army.addUnit(wu.unitType);
      }
    }
    try { await army.saveList(false); } catch { /* proceed anyway */ }
    try {
      await updateProfile.mutateAsync({ userId: user.id, updates: { has_completed_walkthrough: true } });
    } catch { /* proceed anyway */ }
    forceClose();
    navigate(`/builder/${selectedFaction.slug}`);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-hidden={!isOpen}
    >
      {/* Backdrop — not clickable per spec */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Modal panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wt-heading"
        className="relative w-full max-w-2xl bg-dfa-surface border border-dfa-border rounded-xl shadow-2xl flex flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
        style={{ maxHeight: '85vh' }}
      >
        {/* Confirm close overlay */}
        {confirmClose && (
          <ConfirmClose onConfirm={forceClose} onCancel={cancelClose} />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dfa-border shrink-0">
          <StepProgress current={currentStep} />
          <button
            ref={closeButtonRef}
            onClick={askClose}
            aria-label="Close guide"
            className="text-dfa-text-muted hover:text-dfa-text transition-colors ml-3 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 min-h-0">
          {currentStep === 1 && <StepFaction />}
          {currentStep === 2 && (
            <StepUnits
              role="captain"
              heading="Every army needs a leader"
              lore="Captains are the elite commanders of your warband. Choose one to lead your forces into battle — they unlock powerful abilities and inspire those around them."
              isCaptainStep
            />
          )}
          {currentStep === 3 && (
            <StepUnits
              role="specialist"
              heading="Choose your Specialists"
              lore="Specialists are unique fighters with powerful special abilities. They round out your warband with versatility and tactical depth. You can add as many as your points allow."
              isCaptainStep={false}
              canSkip
            />
          )}
          {currentStep === 4 && (
            <StepUnits
              role="core"
              heading="Fill your ranks"
              lore="Core units are the backbone of your army. Affordable and reliable, they make up the bulk of your fighting force. You need at least two to build a valid warband."
              isCaptainStep={false}
            />
          )}
          {currentStep === 5 && <StepReview />}
          {currentStep === 6 && <StepName />}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t border-dfa-border gap-3">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-1.5 px-4 py-2 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
            >
              <ChevronLeft size={15} />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {currentStep >= 3 && currentStep <= 5 && (
              <span className={`text-xs font-mono font-bold ${totalPoints > POINTS_LIMIT ? 'text-red-400' : 'text-dfa-gold'}`}>
                {totalPoints} / {POINTS_LIMIT}pts
              </span>
            )}

            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={!gates[currentStep]}
                className="flex items-center gap-1.5 px-4 py-2 bg-dfa-red hover:bg-dfa-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors"
              >
                Next
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!gates[6] || updateProfile.isPending}
                className="flex items-center gap-1.5 px-5 py-2 bg-dfa-red hover:bg-dfa-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors"
              >
                {updateProfile.isPending ? 'Saving…' : 'Enter the Arena'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
