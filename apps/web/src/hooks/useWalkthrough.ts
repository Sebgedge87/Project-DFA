import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@dfa/supabase-client';
import { useWalkthroughStore } from '../stores/walkthroughStore';

const DISMISSED_KEY = 'dfa-guidedsteps-dismissed';

export function useWalkthrough(userId: string | null) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === '1',
  );
  const dismiss = () => { localStorage.setItem(DISMISSED_KEY, '1'); setDismissed(true); };
  const enable  = () => { localStorage.removeItem(DISMISSED_KEY); setDismissed(false); };

  const { data: profile } = useProfile(userId);
  const autoOpened = useRef(false);
  const open = useWalkthroughStore(s => s.open);

  useEffect(() => {
    if (autoOpened.current || profile === undefined) return;
    autoOpened.current = true;
    if (userId && profile && !profile.has_completed_walkthrough) open();
  }, [profile, userId, open]);

  return { dismissed, dismiss, enable };
}
