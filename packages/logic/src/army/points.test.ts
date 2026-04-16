import { describe, it, expect } from 'vitest';
import { calculatePoints, remainingPoints, isOverPoints, POINTS_LIMIT } from './points';
import type { ArmyEntry, UnitType } from '@dfa/types';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeUnit(points: number, overrides: Partial<UnitType> = {}): UnitType {
  return {
    id: 'unit-1',
    faction_id: 'faction-1',
    name: 'Test Unit',
    role: 'core',
    actions: 2,
    movement: 5,
    melee_attack: 3,
    ranged_attack: 3,
    defence: 4,
    health: 1,
    points,
    max_per_army: null,
    abilities: [],
    image_url: null,
    base_size_mm: 25,
    store_url: null,
    sort_order: 0,
    ...overrides,
  };
}

function makeEntry(points: number, quantity = 1): ArmyEntry {
  return { id: 'entry-1', unit_type: makeUnit(points), quantity };
}

// ── calculatePoints ───────────────────────────────────────────────────────────

describe('calculatePoints', () => {
  it('returns 0 for an empty army', () => {
    expect(calculatePoints([])).toBe(0);
  });

  it('returns the unit cost for a single entry of quantity 1', () => {
    expect(calculatePoints([makeEntry(100)])).toBe(100);
  });

  it('multiplies unit cost by quantity', () => {
    expect(calculatePoints([makeEntry(50, 4)])).toBe(200);
  });

  it('sums across multiple entries', () => {
    expect(calculatePoints([makeEntry(100), makeEntry(75, 2)])).toBe(250);
  });

  it('handles exactly 1,000 pts', () => {
    expect(calculatePoints([makeEntry(500, 2)])).toBe(1000);
  });
});

// ── remainingPoints ───────────────────────────────────────────────────────────

describe('remainingPoints', () => {
  it('returns POINTS_LIMIT for an empty army', () => {
    expect(remainingPoints([])).toBe(POINTS_LIMIT);
  });

  it('subtracts used points from the limit', () => {
    expect(remainingPoints([makeEntry(300)])).toBe(700);
  });

  it('returns 0 at exactly the limit', () => {
    expect(remainingPoints([makeEntry(1000)])).toBe(0);
  });

  it('returns a negative value when over the limit', () => {
    expect(remainingPoints([makeEntry(1001)])).toBe(-1);
  });
});

// ── isOverPoints ──────────────────────────────────────────────────────────────

describe('isOverPoints', () => {
  it('returns false when under the limit', () => {
    expect(isOverPoints([makeEntry(999)])).toBe(false);
  });

  it('returns false at exactly the limit', () => {
    expect(isOverPoints([makeEntry(1000)])).toBe(false);
  });

  it('returns true when one point over', () => {
    expect(isOverPoints([makeEntry(1001)])).toBe(true);
  });
});
