import type { ArmyEntry } from '@dfa/types';

export const POINTS_LIMIT = 1000;

export function calculatePoints(entries: ArmyEntry[]): number {
  return entries.reduce((total, entry) => {
    return total + entry.unit_type.points * entry.quantity;
  }, 0);
}

export function remainingPoints(entries: ArmyEntry[]): number {
  return POINTS_LIMIT - calculatePoints(entries);
}

export function isOverPoints(entries: ArmyEntry[]): boolean {
  return calculatePoints(entries) > POINTS_LIMIT;
}
