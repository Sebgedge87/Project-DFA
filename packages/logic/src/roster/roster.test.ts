import { describe, it, expect } from 'vitest';
import {
  countByRole,
  hasCaptain,
  specialistCount,
  totalModels,
  getUnitEntry,
  specialistSlotsRemaining,
  MAX_SPECIALISTS,
} from './index';
import type { ArmyEntry, UnitType } from '@dfa/types';

let _id = 0;
function uid() { return `id-${++_id}`; }

function makeUnit(overrides: Partial<UnitType> = {}): UnitType {
  return {
    id: uid(),
    faction_id: 'f1',
    name: 'Unit',
    role: 'core',
    actions: 2, movement: 5, melee_attack: 3, ranged_attack: 3,
    defence: 4, health: 1, points: 50, max_per_army: null,
    abilities: [], image_url: null, base_size_mm: 25, store_url: null, sort_order: 0,
    ...overrides,
  };
}

function makeEntry(unit: UnitType, quantity = 1): ArmyEntry {
  return { id: uid(), unit_type: unit, quantity };
}

describe('countByRole', () => {
  it('counts entries of a given role by quantity', () => {
    const entries = [
      makeEntry(makeUnit({ role: 'core' }), 3),
      makeEntry(makeUnit({ role: 'specialist' }), 2),
    ];
    expect(countByRole(entries, 'core')).toBe(3);
    expect(countByRole(entries, 'specialist')).toBe(2);
    expect(countByRole(entries, 'captain')).toBe(0);
  });
});

describe('hasCaptain', () => {
  it('returns false for an empty army', () => {
    expect(hasCaptain([])).toBe(false);
  });

  it('returns true when a captain entry exists', () => {
    expect(hasCaptain([makeEntry(makeUnit({ role: 'captain' }))])).toBe(true);
  });
});

describe('specialistCount', () => {
  it('sums specialist quantities', () => {
    const entries = [
      makeEntry(makeUnit({ role: 'specialist' }), 2),
      makeEntry(makeUnit({ role: 'specialist' }), 1),
      makeEntry(makeUnit({ role: 'core' }), 5),
    ];
    expect(specialistCount(entries)).toBe(3);
  });
});

describe('totalModels', () => {
  it('sums all quantities', () => {
    const entries = [makeEntry(makeUnit(), 3), makeEntry(makeUnit(), 2)];
    expect(totalModels(entries)).toBe(5);
  });
});

describe('getUnitEntry', () => {
  it('finds an entry by unit id', () => {
    const unit = makeUnit();
    const entry = makeEntry(unit);
    expect(getUnitEntry([entry], unit.id)).toBe(entry);
  });

  it('returns undefined when not found', () => {
    expect(getUnitEntry([], 'missing')).toBeUndefined();
  });
});

describe('specialistSlotsRemaining', () => {
  it('returns MAX_SPECIALISTS for an empty army', () => {
    expect(specialistSlotsRemaining([])).toBe(MAX_SPECIALISTS);
  });

  it('decrements as specialists are added', () => {
    const entries = [makeEntry(makeUnit({ role: 'specialist' }), 3)];
    expect(specialistSlotsRemaining(entries)).toBe(1);
  });
});
