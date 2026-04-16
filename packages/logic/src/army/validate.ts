import type { ArmyEntry, UnitType, ValidationResult } from '@dfa/types';
import { calculatePoints, POINTS_LIMIT } from './points';

export function validateAddUnit(
  entries: ArmyEntry[],
  unit: UnitType
): ValidationResult {
  // Points cap
  const projected = calculatePoints(entries) + unit.points;
  if (projected > POINTS_LIMIT)
    return { ok: false, error: 'Army exceeds 1,000 point limit' };

  // Captain limit
  if (unit.role === 'captain') {
    const hasCaptain = entries.some(e => e.unit_type.role === 'captain');
    if (hasCaptain)
      return { ok: false, error: 'Only one Captain is allowed per army' };
  }

  // Specialist limit (max 4 slots)
  if (unit.role === 'specialist') {
    const specialistCount = entries
      .filter(e => e.unit_type.role === 'specialist')
      .reduce((sum, e) => sum + e.quantity, 0);
    if (specialistCount >= 4)
      return { ok: false, error: 'Maximum of 4 Specialist slots per army' };
  }

  // Per-unit cap
  if (unit.max_per_army !== null) {
    const existing = entries.find(e => e.unit_type.id === unit.id);
    const currentQty = existing?.quantity ?? 0;
    if (currentQty >= unit.max_per_army)
      return {
        ok: false,
        error: `Maximum ${unit.max_per_army} of this unit type allowed`,
      };
  }

  return { ok: true };
}

export function validateArmy(entries: ArmyEntry[]): ValidationResult[] {
  const errors: ValidationResult[] = [];

  if (calculatePoints(entries) > POINTS_LIMIT)
    errors.push({ ok: false, error: 'Army exceeds 1,000 point limit' });

  const captainCount = entries.filter(
    e => e.unit_type.role === 'captain'
  ).length;
  if (captainCount === 0)
    errors.push({ ok: false, error: 'Every army must include one Captain' });

  const totalModels = entries.reduce((sum, e) => sum + e.quantity, 0);
  if (totalModels < 5)
    errors.push({ ok: false, error: 'Army must contain at least 5 models' });

  return errors;
}
