import { create } from 'zustand';
import type { Faction, UnitType } from '@dfa/types';

export interface WalkthroughUnit {
  unitType: UnitType;
  quantity: number;
}

interface WalkthroughStore {
  isOpen: boolean;
  currentStep: number;
  selectedFaction: Faction | null;
  expandedFactionId: string | null;
  expandedUnitId: string | null;
  walkthroughUnits: WalkthroughUnit[];
  step3Skipped: boolean;
  armyName: string;
  confirmClose: boolean;

  open: () => void;
  forceClose: () => void;
  askClose: () => void;
  cancelClose: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedFaction: (faction: Faction) => void;
  toggleExpandFaction: (id: string) => void;
  toggleExpandUnit: (id: string) => void;
  addCaptain: (unit: UnitType) => void;
  addUnit: (unit: UnitType) => void;
  removeUnit: (unitId: string) => void;
  adjustQuantity: (unitId: string, delta: 1 | -1) => void;
  skipStep3: () => void;
  setArmyName: (name: string) => void;
}

export const useWalkthroughStore = create<WalkthroughStore>((set, get) => ({
  isOpen: false,
  currentStep: 1,
  selectedFaction: null,
  expandedFactionId: null,
  expandedUnitId: null,
  walkthroughUnits: [],
  step3Skipped: false,
  armyName: '',
  confirmClose: false,

  open: () => set({
    isOpen: true,
    currentStep: 1,
    selectedFaction: null,
    expandedFactionId: null,
    expandedUnitId: null,
    walkthroughUnits: [],
    step3Skipped: false,
    armyName: '',
    confirmClose: false,
  }),

  forceClose: () => set({ isOpen: false, confirmClose: false }),
  askClose: () => set({ confirmClose: true }),
  cancelClose: () => set({ confirmClose: false }),

  nextStep: () => set(s => ({ currentStep: Math.min(s.currentStep + 1, 6), expandedUnitId: null, expandedFactionId: null })),
  prevStep: () => set(s => ({ currentStep: Math.max(s.currentStep - 1, 1), expandedUnitId: null, expandedFactionId: null })),

  setSelectedFaction: (faction) => set({
    selectedFaction: faction,
    expandedFactionId: null,
    walkthroughUnits: [],
    step3Skipped: false,
  }),

  toggleExpandFaction: (id) => set(s => ({
    expandedFactionId: s.expandedFactionId === id ? null : id,
  })),

  toggleExpandUnit: (id) => set(s => ({
    expandedUnitId: s.expandedUnitId === id ? null : id,
  })),

  addCaptain: (unit) => set(s => ({
    walkthroughUnits: [
      ...s.walkthroughUnits.filter(wu => wu.unitType.role !== 'captain'),
      { unitType: unit, quantity: 1 },
    ],
    expandedUnitId: null,
  })),

  addUnit: (unit) => set(s => {
    const existing = s.walkthroughUnits.find(wu => wu.unitType.id === unit.id);
    return {
      walkthroughUnits: existing
        ? s.walkthroughUnits.map(wu => wu.unitType.id === unit.id ? { ...wu, quantity: wu.quantity + 1 } : wu)
        : [...s.walkthroughUnits, { unitType: unit, quantity: 1 }],
    };
  }),

  removeUnit: (unitId) => set(s => ({
    walkthroughUnits: s.walkthroughUnits.filter(wu => wu.unitType.id !== unitId),
  })),

  adjustQuantity: (unitId, delta) => set(s => {
    const updated = s.walkthroughUnits.map(wu =>
      wu.unitType.id === unitId ? { ...wu, quantity: wu.quantity + delta } : wu
    ).filter(wu => wu.quantity > 0);
    return { walkthroughUnits: updated };
  }),

  skipStep3: () => set({ step3Skipped: true }),

  setArmyName: (name) => set({ armyName: name }),
}));
