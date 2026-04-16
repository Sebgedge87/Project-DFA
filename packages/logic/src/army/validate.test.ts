import { describe, it, expect } from 'vitest';
import { validateAddUnit, validateArmy } from './validate';
import type { ArmyEntry, UnitType } from '@dfa/types';

// ── helpers ──────────────────────────────────────────────────────────────────

let _id = 0;
function uid() { return `id-${++_id}`; }

function makeUnit(overrides: Partial<UnitType> = {}): UnitType {
  return {
    id: uid(),
    faction_id: 'faction-1',
    name: 'Core Trooper',
    role: 'core',
    actions: 2,
    movement: 5,
    melee_attack: 3,
    ranged_attack: 3,
    defence: 4,
    health: 1,
    points: 100,
    max_per_army: null,
    abilities: [],
    image_url: null,
    base_size_mm: 25,
    store_url: null,
    sort_order: 0,
    ...overrides,
  };
}

function makeEntry(unit: UnitType, quantity = 1): ArmyEntry {
  return { id: uid(), unit_type: unit, quantity };
}

// ── validateAddUnit — rule 1: points cap ─────────────────────────────────────

describe('validateAddUnit / points cap', () => {
  it('allows a unit that fits within 1,000 pts', () => {
    expect(validateAddUnit([], makeUnit({ points: 999 })).ok).toBe(true);
  });

  it('allows a unit that lands exactly on 1,000 pts', () => {
    const entries = [makeEntry(makeUnit({ points: 900 }))];
    expect(validateAddUnit(entries, makeUnit({ points: 100 })).ok).toBe(true);
  });

  it('blocks a unit that would exceed 1,000 pts', () => {
    const entries = [makeEntry(makeUnit({ points: 900 }))];
    const result = validateAddUnit(entries, makeUnit({ points: 200 }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/1,000 point limit/);
  });
});

// ── validateAddUnit — rule 2 & 3: captain rules ──────────────────────────────

describe('validateAddUnit / captain rules', () => {
  it('allows a captain in an army with no captain', () => {
    expect(validateAddUnit([], makeUnit({ role: 'captain', points: 150 })).ok).toBe(true);
  });

  it('blocks a second captain', () => {
    const captain = makeUnit({ role: 'captain', points: 150 });
    const entries = [makeEntry(captain)];
    const result = validateAddUnit(entries, makeUnit({ role: 'captain', points: 150 }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/one Captain/);
  });
});

// ── validateAddUnit — rule 4: specialist limit ───────────────────────────────

describe('validateAddUnit / specialist limit', () => {
  it('allows the 4th specialist slot', () => {
    const entries = Array.from({ length: 3 }, () =>
      makeEntry(makeUnit({ role: 'specialist', points: 50 }))
    );
    expect(validateAddUnit(entries, makeUnit({ role: 'specialist', points: 50 })).ok).toBe(true);
  });

  it('blocks adding beyond 4 specialist slots', () => {
    const entries = Array.from({ length: 4 }, () =>
      makeEntry(makeUnit({ role: 'specialist', points: 50 }))
    );
    const result = validateAddUnit(entries, makeUnit({ role: 'specialist', points: 50 }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/4 Specialist/);
  });

  it('does not count core units toward the specialist limit', () => {
    const entries = Array.from({ length: 4 }, () =>
      makeEntry(makeUnit({ role: 'core', points: 50 }))
    );
    expect(validateAddUnit(entries, makeUnit({ role: 'specialist', points: 50 })).ok).toBe(true);
  });
});

// ── validateAddUnit — rule 5: per-unit cap ───────────────────────────────────

describe('validateAddUnit / per-unit cap (max_per_army)', () => {
  it('allows adding when under the cap', () => {
    const unit = makeUnit({ max_per_army: 2, points: 100 });
    const entries = [makeEntry(unit, 1)];
    expect(validateAddUnit(entries, unit).ok).toBe(true);
  });

  it('blocks adding when at the cap', () => {
    const unit = makeUnit({ max_per_army: 1, points: 100 });
    const entries = [makeEntry(unit, 1)];
    const result = validateAddUnit(entries, unit);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Maximum 1/);
  });

  it('ignores cap when max_per_army is null', () => {
    const unit = makeUnit({ max_per_army: null, points: 10 });
    const entries = Array.from({ length: 20 }, () => makeEntry(unit, 1));
    expect(validateAddUnit(entries, unit).ok).toBe(true);
  });

  it('counts existing quantity correctly against the cap', () => {
    const unit = makeUnit({ max_per_army: 3, points: 100 });
    const entries = [makeEntry(unit, 3)];
    const result = validateAddUnit(entries, unit);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Maximum 3/);
  });
});

// ── validateArmy — full-army checks ──────────────────────────────────────────

describe('validateArmy', () => {
  it('returns no errors for a valid army', () => {
    const captain = makeUnit({ role: 'captain', points: 150 });
    const core = makeUnit({ role: 'core', points: 50 });
    const entries = [makeEntry(captain), makeEntry(core, 4)];
    expect(validateArmy(entries)).toHaveLength(0);
  });

  it('rule 2 — errors when no captain present', () => {
    const entries = Array.from({ length: 5 }, () =>
      makeEntry(makeUnit({ role: 'core', points: 50 }))
    );
    const errors = validateArmy(entries);
    expect(errors.some(e => /Captain/.test(e.error ?? ''))).toBe(true);
  });

  it('rule 6 — errors when fewer than 5 total models', () => {
    const captain = makeUnit({ role: 'captain', points: 150 });
    // 1 captain + 3 core = 4 models total
    const entries = [makeEntry(captain), makeEntry(makeUnit({ points: 50 }), 3)];
    const errors = validateArmy(entries);
    expect(errors.some(e => /5 models/.test(e.error ?? ''))).toBe(true);
  });

  it('rule 1 — errors when over the points limit', () => {
    const captain = makeUnit({ role: 'captain', points: 800 });
    const entries = [makeEntry(captain), ...Array.from({ length: 4 }, () =>
      makeEntry(makeUnit({ points: 60 }))
    )];
    const errors = validateArmy(entries);
    expect(errors.some(e => /1,000 point/.test(e.error ?? ''))).toBe(true);
  });

  it('can surface multiple errors simultaneously', () => {
    // empty army: no captain + under min models
    expect(validateArmy([])).toHaveLength(2);
  });
});
