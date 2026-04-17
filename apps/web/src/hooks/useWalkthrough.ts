import { useState, useEffect, useRef } from 'react';
import { useProfile, useUpdateProfile } from '@dfa/supabase-client';
import type { UnitType } from '@dfa/types';

const DISMISSED_KEY = 'dfa-walkthrough-dismissed';
const stepKey = (uid: string) => `dfa-walkthrough-step-${uid}`;

export function useWalkthrough(userId: string | null) {
  // ── GuidedSteps bar state (existing inline progress bar) ──────────────
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === '1',
  );
  const dismiss = () => { localStorage.setItem(DISMISSED_KEY, '1'); setDismissed(true); };
  const enable  = () => { localStorage.removeItem(DISMISSED_KEY); setDismissed(false); };

  // ── WalkthroughPanel state ────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => {
    if (!userId) return 1;
    const saved = localStorage.getItem(stepKey(userId));
    return saved ? Math.max(1, Math.min(4, parseInt(saved, 10))) : 1;
  });
  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);
  const autoOpened = useRef(false);

  const { data: profile } = useProfile(userId);
  const updateProfile = useUpdateProfile();

  // Auto-start for new users (once per mount — re-mounts on navigation)
  useEffect(() => {
    if (autoOpened.current || profile === undefined) return;
    autoOpened.current = true;
    if (userId && profile && !profile.has_completed_walkthrough) {
      setIsOpen(true);
    }
  }, [profile, userId]);

  // Persist current step across page refreshes
  useEffect(() => {
    if (userId) localStorage.setItem(stepKey(userId), String(currentStep));
  }, [currentStep, userId]);

  // Re-sync dismissed flag when userId changes (armyStore clears it on faction switch)
  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === '1');
  }, [userId]);

  const open      = () => { setSelectedUnit(null); setCurrentStep(1); setIsOpen(true); };
  const close     = () => setIsOpen(false);
  const nextStep  = () => { setSelectedUnit(null); setCurrentStep(s => Math.min(s + 1, 4)); };
  const prevStep  = () => { setSelectedUnit(null); setCurrentStep(s => Math.max(s - 1, 1)); };
  const selectUnit = (unit: UnitType) => setSelectedUnit(unit);
  const clearUnit  = () => setSelectedUnit(null);

  const complete = async () => {
    if (userId) {
      try {
        await updateProfile.mutateAsync({
          userId,
          updates: { has_completed_walkthrough: true },
        });
      } catch {
        // Walkthrough completes client-side regardless of DB error
      }
      localStorage.removeItem(stepKey(userId));
    }
    setIsOpen(false);
    setCurrentStep(1);
  };

  return {
    // Inline GuidedSteps bar
    dismissed, dismiss, enable,
    // WalkthroughPanel
    isOpen, currentStep, selectedUnit,
    open, close, nextStep, prevStep, selectUnit, clearUnit, complete,
    isSavingComplete: updateProfile.isPending,
  };
}
