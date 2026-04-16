import type { ArmyEntry, UnitRole } from '@dfa/types';

export const MAX_SPECIALISTS = 4;
export const MIN_MODELS = 5;
export const MAX_CAPTAINS = 1;

export function countByRole(entries: ArmyEntry[], role: UnitRole): number {
  return entries
    .filter(e => e.unit_type.role === role)
    .reduce((sum, e) => sum + e.quantity, 0);
}

export function hasCaptain(entries: ArmyEntry[]): boolean {
  return entries.some(e => e.unit_type.role === 'captain');
}

export function specialistCount(entries: ArmyEntry[]): number {
  return countByRole(entries, 'specialist');
}

export function totalModels(entries: ArmyEntry[]): number {
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}

export function getUnitEntry(entries: ArmyEntry[], unitId: string): ArmyEntry | undefined {
  return entries.find(e => e.unit_type.id === unitId);
}

export function specialistSlotsRemaining(entries: ArmyEntry[]): number {
  return MAX_SPECIALISTS - specialistCount(entries);
}
